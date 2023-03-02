import path = require('path');
import { style } from './style';
import { getReviewForCode } from './openAiClient';
import * as vscode from 'vscode';

const WORKSPACE = 'clippyReview';
const API_KEY = 'openAiApiKey';
const MODEL = 'openAiModel';
const MAX_TOKENS = 'maxTokens';

const CHAT_GPT_MODEL = 'gpt-3.5-turbo';

const renderHtml = (msg: string, img: vscode.Uri) => `
  <style>
    ${style}
  </style>
  <body>
    <div class="container">
      <div class="message">${msg}</div>
      <img class="image" src="${img}" />
    </div>
  </body>
`;

export function activate(context: vscode.ExtensionContext) {
  let clippy: vscode.WebviewPanel | undefined = undefined;
  let disposable = vscode.commands.registerCommand('code-review-clippy.clippyReview', async () => {
    if (!clippy) {
      clippy = vscode.window.createWebviewPanel("clippy", "Clippy hates your code", {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true
      });
    }

    const imageUrl = vscode.Uri.file(
      path.join(context.extensionPath, "clippy.png")
    );

    const editor = vscode.window.activeTextEditor;
    let highlight;
    if (editor) {
      let cursorStart = editor.selection.start;
      let cursorEnd = editor.selection.end;
      const range: vscode.Range = new vscode.Range(cursorStart, cursorEnd);
      highlight = editor.document.getText(range);
    }

    const content = await validateAndCreateContent(editor, highlight);
    const img = clippy.webview.asWebviewUri(imageUrl);
    clippy.webview.html = renderHtml(content, img);

    clippy.onDidDispose(
      () => {
        clippy = undefined;
      },
      null,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

const validateAndCreateContent = async (editor: vscode.TextEditor | undefined, highlight: string | undefined) => {
  const apiKey = vscode.workspace.getConfiguration(WORKSPACE).get(API_KEY, undefined);
  if (apiKey === null || !apiKey) {
    return toErrorMessage('No OpenAI API-key set!');
  }
  if (!editor) {
    return toErrorMessage('There\'s no active editors open.');
  }
  if (!highlight) {
    return toErrorMessage('There\'s no text on the editor!');
  }
  if (highlight.length > 1000) {
    return toErrorMessage('That\'s a long text, Clippy can\t read that much.');
  }

  const maxTokens = vscode.workspace.getConfiguration(WORKSPACE).get(MAX_TOKENS, 1024);
  const model = vscode.workspace.getConfiguration(WORKSPACE).get(MODEL, CHAT_GPT_MODEL);
  const isModelChatGPT = model === CHAT_GPT_MODEL;

  const clippyOpts = {
    apiKey: String(apiKey),
    model,
    maxTokens,
    codeToReview: highlight,
    isModelChatGPT,
  };

  return getReviewForCode(clippyOpts)
    .then((res) => {
      return isModelChatGPT
        ? res.data.choices[0].message.content
        : res.data.choices[0].text;
    })
    .catch((e) => toErrorMessage(e.message));
};

const toErrorMessage = (errorMsg: string): string => {
  return `${generateErrorPrefix()}\n\n${errorMsg}`;
};

// These were generated by chatgpt, that's why they suck
const generateErrorPrefix = () => {
  const messages = [
    "Well, this is awkward. It seems like something went wrong. Let's pretend it didn't happen and start over, shall we?",
    "Oopsie daisy! Looks like there's a hiccup in the system. No worries, we'll have it fixed in a jiffy.",
    "Houston, we have a problem. But don't worry, we've got our finest scientists on the case to sort this out.",
    "Whoopsie, did we goof up? It's okay, we all make mistakes. Let's just learn from it and move forward.",
    "Oh dear, it seems like things are not going as planned. Don't worry, we'll get this sorted out and have you on your way in no time.",
    "That's not good.",
    "Clippy doesn\'t like this.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export function deactivate() { }

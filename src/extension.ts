import path = require('path');
import { style } from './style';
import * as vscode from 'vscode';

const renderHtml = (msg: string, img: vscode.Uri) => `
  <style>
    ${style}
  </style>
  <body>
    <div class="message blurred">${msg}</div>
    <div class="pointer blurred"></div>
    <img src="${img}" />
  </body>
`;

export function activate(context: vscode.ExtensionContext) {
  let clippy: vscode.WebviewPanel | undefined = undefined;
  let disposable = vscode.commands.registerCommand('code-review-clippy.clippyReview', () => {
    if (!clippy) {
      clippy = vscode.window.createWebviewPanel("clippy", "Clippy", {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true
      });
    }

    const imageUrl = vscode.Uri.file(
      path.join(context.extensionPath, "clippy.png")
    );

    const editor = vscode.window.activeTextEditor;
    let highlight = 'Theres no active editors open. You should probably fix that.';
    if (editor) {
      let cursorPosition = editor.selection.start;
      let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
      highlight = editor.document.getText(wordRange);
    }

    const img = clippy.webview.asWebviewUri(imageUrl);
    clippy.webview.html = renderHtml(highlight, img);

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

export function deactivate() { }

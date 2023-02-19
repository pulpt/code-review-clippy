import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('code-review-clippy.clippyReview', () => {
		const clippy = vscode.window.createWebviewPanel("clippy", "Clippy", {
			viewColumn: vscode.ViewColumn.Beside,
			preserveFocus: true
		});
		const editor = vscode.window.activeTextEditor;
		let highlight = 'Theres no active editors open. You should probably fix that.';
		if (editor) {

			let cursorPosition = editor.selection.start;
			let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
			highlight = editor.document.getText(wordRange);
		}

		clippy.webview.html = `<div>${highlight}</div>`;
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }

import { transposeOctUp } from "./src/test/testTransposeFunctions";
const vscode = require("vscode");

module.exports.macroCommands = {
  OctUp: {
    no: 1,
    func: OctUp,
  },
};

const editor = vscode.window.activeTextEditor;

function OctUp() {
  if (!editor) {
    // Return an error message if necessary.
    return "Editor is not opening.";
  }
  const document = editor.document;
  const selection = editor.selection;
  const text = document.getText(selection);
  if (text.length > 0) {
    editor.edit((editBuilder: any) => {
      // To surround a selected text in double quotes(Multi selection is not supported).
      editBuilder.replace(selection, transposeOctUp(text));
    });
  }
}

function WrapInTag() {
  const currentLineNumber = editor.selection.active.line;
  const currentLine = editor.lineAt(currentLineNumber);
}

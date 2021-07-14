import * as ts from "typescript";

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
	return (sourceFile) => {
		console.log(ts.createPrinter().printFile(sourceFile));
		console.log("-----------------------------------------");

		const visitor = (node: ts.Node): ts.Node => {
			logDebug(sourceFile, node);

			if (ts.isVariableStatement(node)) {
				const variableStatement = node;
				let result: any = null;
				variableStatement.forEachChild(child => {
					logDebug(sourceFile, child, "child node ");

					if (ts.isVariableDeclarationList(child)) {
						child.forEachChild((childChild) => {
							logDebug(sourceFile, childChild, "child child node ");
							if (ts.isVariableDeclaration(childChild)) {
								// result = ts.createStringLiteral("fuuuu")
							}
						})
					}
				})

				if (result) {
					return result;
				}
			}

			return ts.visitEachChild(node, visitor, context);
		};

		return ts.visitNode(sourceFile, visitor);
	};
};

function logDebug(sourceFile: ts.SourceFile, node: ts.Node, prefix: string = "") {
	let text = ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, sourceFile)
	try {
		text = node.getText();
	} catch (err) { }
	console.log(`${prefix} kind ${node.kind}: ${text}`);
}
export default transformer;

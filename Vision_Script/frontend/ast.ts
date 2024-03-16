export type NodeType=
"Program"
|"BinaryExpr"
|"Identifier"
|"NumericLiteral"
|"VarDecl"
|"VarAssign"
|"Keyword"
|"PrintStmnt"
|"String"
|"FuncDef"
|"NL"
|"Comment"
|"IfStatement"
|"IfElseStmnt"
|"ImportFunc"
|"ExportFunc"


export type Keywords = 
"Print"
"Let"
"Const"


export interface Stmnt{
    kind: NodeType
}
export interface Program extends Stmnt{
    kind: "Program",
    Body: Stmnt[]
}
// deno-lint-ignore no-empty-interface
export interface Expr extends Stmnt{}

export interface BinaryExpr extends Expr{
    kind: "BinaryExpr"
    left: Expr,
    right: Expr,
    operator: string,
}

export interface printStmnt extends Stmnt{
    kind:"PrintStmnt"
    left: Keyword
    right: Identfier
    Link: string
}

export interface VarDecl extends Expr{
    kind:"VarDecl",
    consCheck: boolean
    Identifier: string
    value?: Expr
}
export interface FuncDef extends Stmnt{
    kind: "FuncDef",
    Identifier: string,
    parameters?: Expr
    code?: Expr
}
export interface VarAssignment extends Stmnt{
    kind:"VarAssign",
    Identifier: string
    value: Expr
}
export interface Identfier extends Expr{
    kind: "Identifier"
    symbol:string
}

export interface NumericLiteral extends Expr{
    kind:"NumericLiteral"
    value:number
}
export interface Stringtp extends Expr{
    kind:"String"
    value: string
}


 
export interface Keyword extends Expr{
    kind:"Keyword"
    value: Keywords
}
export interface NewLine extends Expr{
    kind:"NL"
    value:string
    type:number
}

export interface Comment extends Stmnt{
    kind:"Comment"
}
export interface IfStmnt extends Stmnt{
    kind:"IfStatement"
    condition: Stmnt
    code: Stmnt
    elsecode: Stmnt
}  

export interface ImportFunc extends Stmnt{

    kind: "ImportFunc",
    moduleName: string,
    
}
export interface ExportFunc extends Stmnt{

    kind: "ExportFunc",
    moduleName: string,
    
}

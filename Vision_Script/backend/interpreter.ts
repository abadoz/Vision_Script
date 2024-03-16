// deno-lint-ignore-file

import {  BinaryExpr, NumericLiteral,NodeType,Program,Stmnt, Identfier, printStmnt, Keyword, Keywords ,Stringtp,  Expr, VarDecl, VarAssignment, IfStmnt, ExportFunc, ImportFunc} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { NullVal, NumberVal, RuntimeVal, ValueType, KeywordVal, IdentVal, StringVal, MK_Null, MK_Number,MK_bool} from "./values.ts";

function eval_program(program: Program, env:Environment){
    let lastEval: RuntimeVal = MK_Null();
      for(const statement of program.Body){
          lastEval = evaluate(statement, env);
      }
    return lastEval;
  }

  
export function evaluate(astNode: Stmnt, env: Environment): any{
    
    switch(astNode.kind){
       case "NumericLiteral":
        return{
            value: ((astNode as NumericLiteral).value), type: "number"
        } as NumberVal
       case "BinaryExpr":
          return evaluateBinaryExpr(astNode as BinaryExpr, env)
  
       case "Program":
          return eval_program(astNode as Program, env)
     
        case "Identifier":
            return evalIdentifier(astNode as Identfier, env)
        case "PrintStmnt":
            return evaluatePrintStmnt((astNode as printStmnt), env);
        case "Keyword":
            return {
                value: ((astNode as Keyword).value), type:"Keyword"
            } 
        case "IfStatement":
            return eval_IfStmnt(astNode as IfStmnt, env);
        case "VarDecl":
            return eval_VarDecl(astNode as VarDecl, env)
        case "VarAssign":
            return eval_VarAssign(astNode as VarAssignment, env)
        case "ImportFunc":
            return eval_importFunc(astNode as ImportFunc, env)
        case "ExportFunc":
            return eval_exportFunc(astNode as ExportFunc, env)
        case "String":
            return {
                value: ((astNode as Stringtp).value), type:"String"
            } 
       
       default:
        console.error("This Ast node has not yet been setup for interpretation", astNode)
        Deno.exit(1)
        
    }

}
// deno-lint-ignore no-explicit-any
function evaluatePrintStmnt(printst: printStmnt, env: Environment):any{
    const lhs = evaluate(printst.left, env);
    const rhs = evaluate(printst.right, env);
    
    if(lhs.type == "Keyword" && lhs.value == "Print"){
         return {value: rhs.value, type: rhs.type}.value as RuntimeVal
    } 
        return MK_Null()
                       
}



function evaluateBinaryExpr(binop: BinaryExpr, env: Environment):RuntimeVal{
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);
    
    if(lhs.type == "number" && rhs.type == "number"){
         return eval_numeric_binary(lhs as NumberVal, rhs as NumberVal, binop.operator);
    } 
    if(lhs.type == "String" && rhs.type == "String"){
        return eval_string_binary(lhs as StringVal, rhs as StringVal, binop.operator);
   } 
        return {type:"null", value:null} as NullVal;
                       
}


function eval_numeric_binary(lhs: NumberVal, rhs: NumberVal, operator: string):NumberVal{
// deno-lint-ignore no-inferrable-types
let results:number = 0;
    if(operator == '+'){
    results = lhs.value + rhs.value;
   }if(operator == '-'){
    results = lhs.value - rhs.value;
   } if(operator == '*'){
    results = lhs.value * rhs.value;
   }if(operator == '/'){
    results = lhs.value / rhs.value;
   }
   return {value:results, type:"number"};
} 
function eval_string_binary(lhs: StringVal, rhs: StringVal, operator: string):StringVal{
    // deno-lint-ignore no-inferrable-types
    let results:string = "";
        if(operator == '+'){
            
        results = lhs.value + rhs.value;
     
      
    } 
    return {value:results, type:"String"};
}
function evalIdentifier(ident: Identfier,env: Environment): RuntimeVal {
 let varval = env.lookUpVar(ident.symbol);
 return varval;
}


function eval_VarDecl(varDecl: VarDecl,env: Environment) {
let value:any = varDecl.value  ? evaluate(varDecl.value, env):MK_Null();
 return env.declareVar(varDecl.Identifier, value, varDecl.consCheck)
}

function eval_VarAssign(varAs: VarAssignment,env: Environment) {
let value: any = evaluate(varAs.value, env);
return env.assignVar(varAs.Identifier, value)
}

function eval_IfStmnt(ifstmnt: IfStmnt, env: Environment){

  if(ifstmnt.condition.kind == "VarAssign"){
   
    let condition = ifstmnt.condition as VarAssignment;
    let ident: any = evalIdentifier({kind:"Identifier", symbol: condition.Identifier}, env);
    let val = evaluate(condition.value, env);
    if(ident.value == val.value){
       
        let code = evaluate(ifstmnt.code, env)
       
       return code;
    } else if(ifstmnt.elsecode != null){
        return evaluate(ifstmnt.elsecode, env);
    } else{
        return MK_Null()
    }
  }

  return MK_Null()
  
}
function eval_importFunc(iF: ImportFunc, env: Environment){
    let moduleName = iF.moduleName;
    env.importModule(moduleName, env);
    return MK_Null();
}
function eval_exportFunc(eF: ExportFunc, env: Environment){
    let moduleName = eF.moduleName;
    env.exportModule(moduleName, env);
    return MK_Null();
}
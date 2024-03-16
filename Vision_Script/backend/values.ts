import { Identfier } from "../frontend/ast.ts"
import { isInt } from "../frontend/lexer.ts"

export type ValueType = "number" | "null" | "Identifier"|"Keyword"|"String"|"Boolean"

export interface RuntimeVal{
    type: ValueType
}

export interface NumberVal extends RuntimeVal{
    type: "number"
    value: number
}
export interface NullVal extends RuntimeVal{
    type: "null"
    value: null
}
export interface BoolVal extends RuntimeVal{
    type: "Boolean"
    value: boolean
}
const Keywords:Record<string, ValueType> = {
        "Print": "Keyword",
        "Let": "Keyword"
}
let str = "";
let reserved = Keywords[str];
export interface KeywordVal extends RuntimeVal{
    type: "Keyword"
    value:  typeof reserved;
}

export interface StringVal extends RuntimeVal{
    type:"String",
    value:string
}

export interface IdentVal extends RuntimeVal{
    type: "Identifier"
    value: string
}

export function MK_Null(){
   return {type:"null", value:null} as NullVal
}

export function MK_Number(n:number = 0){
    return {type:"number", value:n} as NumberVal
 }

 export function MK_bool(b = true){
     return{type:"Boolean", value: b} as BoolVal
 }

 export function Mk_input(i: string|undefined,p:  boolean){
    let propt = p;
    let txt:string|null = "";
     if(propt==true){
       txt = prompt(i)
    } else{
        undefined;
    }
    
   let val =  {type:"String", value: txt} as StringVal
    if(includesInt(val.value)){
    
      if(isNaN(val.value as unknown as number)){
      
        
        return val;
        
      } else{
        return {type: "number", value: parseInt(val.value)}
      
    }                                                                                                
        
         
         
    } 
  
 }
export interface moduleExports{
    variables: Map<string, RuntimeVal>[]
}
function includesInt(str: string | null){
    return(str?.includes('0') || str?.includes('1') || str?.includes('2') || str?.includes('3') || str?.includes('4') || str?.includes('5') || str?.includes('6') || str?.includes('7') || str?.includes('8') || str?.includes('9') || str?.includes('.'))
}
function nnc(str: string){
    return (str?.includes('0') == false || str?.includes('1') == false || str?.includes('2') == false  || str?.includes('3') == false || str?.includes('4') == false  || str?.includes('5') == false || str?.includes('6') == false || str?.includes('7') == false || str?.includes('8') == false || str?.includes('9') == false || str.includes('.') == false )
}
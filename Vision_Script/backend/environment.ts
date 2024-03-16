
import { Mk_input, RuntimeVal } from "./values.ts"
import {moduleExports} from "./values.ts"

export default class Environment{
  
     private parent?: Environment
     public variables:Map <string, RuntimeVal>
     private constants:Set <string>
     public importables: Map <string, RuntimeVal|null>
    public functions:Map<string,RuntimeVal|null>
     constructor (parentEnv?: Environment){
        this.parent = parentEnv
        this.variables = new Map()
        this.constants = new Set()
        this.functions = new Map()
        this.importables = new Map()

     }
  
     public declareVar(varname: string, val: RuntimeVal, constant: boolean):RuntimeVal{
        if(this.variables.has(varname)){
            throw `Cannot declare variable ${varname} Because it already is defined`
        }
        this.variables.set(varname, val)
        if(constant == true){
         this.constants.add(varname)
       
        }
       
        return val
     }
     
     public assignVar(varname:string, val: RuntimeVal):RuntimeVal{
          const env = this.resolveVar(varname)
         
          env.variables.set(varname, val)
          if(env.constants.has(varname)){
            throw `Cannot reassign '${varname}' as it is a constant`
          }
          return val
     }

     public lookUpVar(varname:string):RuntimeVal{
           const env = this.resolveVar(varname)
           if(env.functions.has(varname)){
            return env.runFunc(varname, env) as RuntimeVal
           }
           return env.variables.get(varname) as RuntimeVal
     }
     public resolveVar(varname:string):Environment{
      if(this.variables.has(varname) || this.functions.has(varname)){
       return this;
      } 

      if(this.parent == undefined){
       throw `Cannot resolve '${varname}' as it does not exist.`
      }
      return this.parent.resolveVar(varname)
    }
     public defineFunc(funcName: string, FuncCode: RuntimeVal|null){
           if(this.functions.has(funcName)){
            throw`Cannot create function '${funcName}' as it already exists`
           }
           this.functions.set(funcName, FuncCode)
           return FuncCode;
     }

     public runFunc(funcName: string, env: Environment){
      
      if(this.functions.has(funcName)){

          switch(funcName){
            case "in": {
              let func = env.runInputFunc(funcName, env)
              
            return func;
            }
          }
      }
     
     }
   public runInputFunc(funcName: string, env: Environment){
              env.functions.get("in")
              let funcCode = Mk_input("", true)
              env.functions.set("in", funcCode as RuntimeVal)
            
              return funcCode
   }
 public exportModule(moduleName: string, env: Environment){
  let expVariables: Map <string, RuntimeVal> = new Map();
    let moduleContents: moduleExports = {
       variables: [expVariables.keys(), expVariables.values()] as unknown as Map<string, RuntimeVal>[]
    }
       
    while(env.variables.size > 0){
      expVariables.set(env.variables.keys().next().value, env.variables.get(env.variables.keys().next().value) as RuntimeVal);
      
    }
  Deno.writeTextFile(moduleName + ".ts", `export default ${JSON.stringify(moduleContents)}`);}

   public async importModule(moduleName: string, env: Environment){
    let moduleContents = await Deno.readTextFile(moduleName + ".ts");
    let loadedModule = JSON.parse(moduleContents) as moduleExports;
    env.variables.set(loadedModule.variables.keys().next().value, loadedModule.variables.values().next().value as RuntimeVal);
 }
 }
 

import Parser from "./frontend/parser.ts";
import {evaluate} from "./backend/interpreter.ts"
import Environment from "./backend/environment.ts";
import { MK_Null, MK_bool, MK_Number, Mk_input,} from "./backend/values.ts";
import { Program } from "./frontend/ast.ts";

async function shell(){
    let parser = new Parser();
    let env = new Environment()
    env.declareVar("true", MK_bool(true), true)
    env.declareVar("false", MK_bool(false), true)
    env.declareVar("null", MK_Null(), true)
    env.functions.set("in", null)
  
 
  

    while(true){
        let input = prompt("Vision script > Version 1.0 2024> Enter the name of your Vision Script file:")
        // check for no user input or exit keyword
        if(!input || input.includes("exit")){
            Deno.exit()
        }
        let   fileName: string = "./" + input + ".vsc";
        let code = await Deno.readTextFile(fileName)
        let program = parser.produceAst(code);
        let result = evaluate(program, env)
        
        console.log(result)
        code = ""
        program = null as unknown as Program;
        result = null as unknown as Program
       
    }
    
}

shell()








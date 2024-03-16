// deno-lint-ignore-file
import { Tokenize,Token,TokenType } from "./lexer.ts";
import { Program,Stmnt, BinaryExpr,Expr,NumericLiteral,Identfier, printStmnt, Keyword, Keywords, Stringtp,  VarDecl, VarAssignment, FuncDef, NewLine, Comment, IfStmnt, ExportFunc, ImportFunc, } from "./ast.ts";

export default class Parser{
    
   private tokens: Token[] = []
   private notEof (): boolean{
       return this.tokens[0].type != TokenType.Eof
   }
   public produceAst(sourceCode:string):Program{
    this.tokens = Tokenize(sourceCode);
    const program:Program = {
         kind:"Program",
         Body: [],

    } 
    while(this.notEof()){
           program.Body.push(this.parseStmnt())
    }
    return program;
   } 
  private at(){
    return this.tokens[0] as Token
  }
   private eat(){
     const prev = this.tokens.shift() as Token;
     return prev;
   }
   private isSkip(){
    
        while(this.at().type == TokenType.skip){

               this.eat()           

            }
          
     return null as unknown as Expr;
   }
   private expect(type: TokenType, err:any):Token{
       const prev = this.eat();
       if(!prev || prev.type != type){
            console.error("Parser error:", err, prev, "Expecting:",type)
            Deno.exit(1)
       }
       return prev;
   }
   private parseString(tk: TokenType):Stringtp{
         let val: string="";
         let stringp: Stringtp ={
            kind:"String",
            value: val,
         } ;
            
                while(this.at().type != TokenType.Quotes){
                        
                        
                        if(this.at().type == TokenType.skip){
                            if(this.at().value == " "){
                                val+=this.eat().value;
                            } else if(this.at().value == "\t"){
                                 val+= "    "
                                 this.eat()
                            } else if(this.at().value == "\n"){
                                console.error("Cannot complete string", `'${val}'`, "while there is new line")
                                Deno.exit(1)
                            } else if(this.at().type == TokenType.skip && this.at().value != " " || this.at().value != "\t"){
                                val+=this.eat().value;
                            }
                        } else{
                            val += this.eat().value;
                        }
                        
                        stringp = {
                            kind:"String",
                            value: val,
                         } as Stringtp
                        
                    
           }
           
           return stringp;
        }
   private parseStmnt():Stmnt{
         const tk = this.at().type
           switch(tk){
            case TokenType.Import: 
               return this.parseImportFunc()
            case TokenType.Export:
                return this.parseExportFunc()
            case TokenType.Print:
                return this.parsePrintStmnt()
            case TokenType.Let: 
                return this.parseVarDecl()
            case TokenType.Const:
                return this.parseVarDecl()
            
            case TokenType.If:
                return this.parseIfStmnt()
            default:
                return this.parseExpr()
           }
   }
   private parseImportFunc(): Stmnt{
    this.eat();
    let moduleName = this.eat().value;
    this.eat()

    return {
        kind:"ImportFunc",
        moduleName,
    } as ImportFunc;
   }
   private parseExportFunc(): Stmnt{
       this.eat();
       let moduleName = this.eat().value;
       this.eat();
       
       return {
           kind:"ExportFunc",
           moduleName,
       } as ExportFunc;
   }
private parseIfStmnt(): Stmnt {
this.eat();
this.isSkip()
this.expect(TokenType.Colon, "Could not find ' : ' after 'If' keyword.")
this.isSkip()
let condition = this.parseStmnt();
this.isSkip()
this.expect(TokenType.Colon, "Could not find ' : ' after If condition.")
let codd: Stmnt = null as unknown as Stmnt;
let cond: Stmnt = condition;
if(this.at().value != ';'){
    let code = this.parseStmnt();
    codd = code;
    condition = {
        kind:"IfStatement",
        condition,
        code,

    } as IfStmnt;    
    this.isSkip()
    if(this.at().type == TokenType.NewLine){
        this.eat()
    }
  
}
this.expect(TokenType.SemiColon, "Could not find Semi Colon after If Statement"); 
    this.isSkip()
    if(this.at().type == TokenType.NewLine){
        this.eat()
    }
  
    this.isSkip();
    if(this.at().value != "Else"){
        return condition;
    }
    this.expect(TokenType.Else, "No 'Else' keyword after if statement.")
    this.isSkip()
    this.expect(TokenType.Colon, "Expected ' : ' after If Else statement")
    if(this.at().value != ';'){
        let code = this.parseStmnt();
        
        condition = {
            kind:"IfStatement",
            condition: cond,
            code: codd,
            elsecode: code
    
        } as IfStmnt;    
        this.isSkip()
        if(this.at().type == TokenType.NewLine){
            this.eat()
        }
      
    }
    this.expect(TokenType.SemiColon, "Could not find Semi Colon after If Statement"); 
        this.isSkip()
        if(this.at().type == TokenType.NewLine){
            this.eat()
        }
      
        this.isSkip();
        return condition;

    

}

private parseComment(): Stmnt {
    this.eat()
     if(this.at().value == "/"){
        this.eat();
     }
     while(this.at().type != TokenType.NewLine || this.at().type != TokenType.NewLine){
       this.eat();
     }
     this.isSkip()
   return this.parseStmnt()
}
private parseFuncDef(): Stmnt {
    this.isSkip();
    this.eat();
    this.isSkip();
    let ident = this.expect(TokenType.Identifier, "No Identifier found after Function keyword. Expected Identifier token.").value
    this.isSkip();
    this.expect(TokenType.Lpran, "No opening parenthesis in function definition.")
    this.isSkip()
    let parameters = this.parseExpr();
    this.isSkip()
    this.expect(TokenType.LBrack, "No opening Brackets in function definition.")
    this.isSkip();
    let code = this.parseStmnt();
    this.expect(TokenType.RBrack, "No closing Brackets in function definition.")
    return {
        kind:"FuncDef",
        Identifier: ident,
        parameters,
        code,
    } as FuncDef

}

   
   private parsePrintStmnt():Stmnt{
    this.isSkip()
    let left = this.expect(TokenType.Print, "Unexpected Keyword").value;
     let print = {
        kind:"PrintStmnt",
        left:   {kind:"Keyword", value:"Print"},
        right: undefined as unknown as  Expr,
        Link: ":"
     } as printStmnt;
    while(this.at().value == ':'){
     const Link = this.eat().value;
     const right =  this.parseExpr();
     
     print = {
         kind:"PrintStmnt",
         left: {kind:"Keyword", value:left} as Keyword,
         right,
         Link,

     } as printStmnt
     this.expect(TokenType.SemiColon, "No semiColon found at the end of Print Statement")
 
    }
    return print;
   
   } 
  private parseVarDecl(): Stmnt{
    this.isSkip()
    let isConstant = this.eat().type == TokenType.Const;
    this.isSkip()
    let Identifier = 
    this.expect
    (TokenType.Identifier, "Expected Identifier after let|const keywords",).value;
    this.isSkip()
    if(this.at().type == TokenType.SemiColon){
        this.eat();
        if(isConstant){
          throw 'Must assign value to constant variables. No value provided'
        }
        this.eat();
        return {
                kind:"VarDecl", 
                Identifier, 
                consCheck:false
                } as VarDecl
                
    }
    this.isSkip()
   this.expect(TokenType.Equals, "Expected Equals Token after Identifier in Variable Declaration")
   this.isSkip()
   const declaration = {kind: "VarDecl", Identifier: Identifier, value: this.parseExpr(), consCheck: isConstant} as  VarDecl;
   this.expect(TokenType.SemiColon, "Expected SemiColon")
   this.isSkip()
  return declaration;
}
   private parseExpr():Expr{
    return(this.parseAdditiveExpr())
   }



    private parseAdditiveExpr():Expr{
        this.isSkip()
        let left = this.parseMultiplicativeExpr();

        while(this.at().value == '+' || this.at().value == '-'){
         const operator = this.eat().value;
         const right =  this.parseMultiplicativeExpr();

         left = {
             kind: "BinaryExpr",
             left,
             right,
             operator
         } as BinaryExpr
        }
        
        return left;
       
    }

    private parseMultiplicativeExpr():Expr{
        this.isSkip()
        let ident = this.at().value;
        let left = this.parsePrimaryExpr();
        while(this.at().value == '*' || this.at().value == '/'){
         const operator = this.eat().value;
         const right =  this.parsePrimaryExpr();
         left = {
             kind: "BinaryExpr",
             left,
             right,
             operator
         } as BinaryExpr
        
        }
       this.isSkip();
        while(this.at().value == '='){
            this.eat();
          this.isSkip()
           
           left={
            kind:"VarAssign",
            Identifier: ident,
            value: this.parseExpr() 
           } as VarAssignment
           this.expect(TokenType.SemiColon, "No SemiColon provided after Variable Assignment.")
           
        } 
       return left;
    } 
   private parsePrimaryExpr():Expr{
    const tk = this.at().type;
    switch(tk){
        case TokenType.Identifier:{
            
               return{kind:"Identifier", symbol: this.eat().value} as Identfier
           
            
        
    }
        case TokenType.Number:
            return{kind:"NumericLiteral", value: parseFloat(this.eat().value)} as NumericLiteral
        case TokenType.Lpran:{
            this.eat();
            const value = this.parseExpr();
            this.expect(TokenType.Rpran, "Unexpected token found in parenthesised expression. Expected closing parenthesis.")
            return value;
        
    
        }


        case TokenType.Quotes:
            {
                this.eat();
        
                let value = this.parseString(tk);
                if(this.at().type == TokenType.Quotes){
                    this.eat()
                    return value;
                }
                
              
        
            }

        
        case TokenType.LBrack:
            {
               let value: any = this.eat();
                while(this.at().value != '}'){
                    value = this.parseStmnt();
                    this.eat();
                }
                
                
                 return value;
              
        
            }
        case TokenType.BinaryOperator:
            
            return  this.parseComment()
        case TokenType.Print:
            return {kind:"Keyword", value:this.eat().value} as Keyword   
        case TokenType.Let:
            return{kind:"Keyword", value:this.eat().value} as Keyword
        case TokenType.Const:
            return{kind:"Keyword", value:this.eat().value} as Keyword
        case TokenType.NewLine:
            this.eat()
           return this.parseStmnt()
        default:
            console.error("Unexpected token found during parsing! :", this.at())
            Deno.exit(1)
            
        
    }
   }
}

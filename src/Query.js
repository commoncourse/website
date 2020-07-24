import parse from './Utils.js'
import Clause from './Clause.js'

class Query {
    #rawString;
    #clauses;

    constructor(expr) {
        expr = expr.replace(/and/g, '&&').replace(/or/g, '||').replace(/\s*/g,'');
        this.#rawString = expr;
        this.#clauses = [];
        
        if (expr === '') return;


        try {
            expr.toLowerCase().split(new RegExp(/&&|\|\|/)).forEach(element => {
                this.#clauses.push(new Clause(element));
            });
        }
        catch (e) {
            throw new Error('One or more clauses are invalid.'); 
        }

        try {
            this.validateQuery();
        }
        catch (e) {
            throw new Error('Query structure is invalid!')
        }
    }

    validateQuery() {
        let parsedArray = [];
        this.#rawString.toLowerCase().split(new RegExp(/(&&|\|\|)/)).forEach(element => {
            if (element === '&&' || element === '||') parsedArray.push(element);
            else parsedArray.push(element.replace(/\s*/g,'').replace(new RegExp(/[\w<>=]+/g), '1'));
        });
        try {
            parse(parsedArray.join(''));
        }
        catch (e) {
            throw new Error(`${this.#rawString} is invalid - 2!`);
        }
    }     
    
    evaluate(course) {
        if (this.#rawString === '') return true;
        
        let results = [];
        let parsedArray = [];
        let resultIndex = 0;

        this.#clauses.forEach(element => {
            console.log(`result: ${course.satisfiesClause(element)}`)
            results.push(`${course.satisfiesClause(element)}`);
        });
    
        this.#rawString.toLowerCase().split(new RegExp(/(&&|\|\|)/)).forEach((element, index) => {
            if (element === '&&' || element === '||') parsedArray.push(element);
            else {
                parsedArray.push(element.replace(/\s*/g,'').replace(new RegExp(/[\w<>=]+/g), results[resultIndex]));
                resultIndex++;
            }
        });

        try {
             return parse(parsedArray.join(''));
        }
        catch (e) {
            throw new Error('Query structure is invalid.')
        }
    }
}

export default Query;
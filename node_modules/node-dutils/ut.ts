
/* Dipankar's Fev UT libs */
import { DLog } from "./dlog";
export class UT {
    p_count: number;
    f_count: number
    constructor() {
        this.p_count = 0;
        this.f_count = 0;
    }
    public check(observed: any, expected: any) {
        if (observed == expected) {
            DLog.s("Test pass")
            this.p_count++;
        } else {
            
            try{
                throw( new Error("Failed"));
            } catch(e){
                let loc = e.stack.split("\n")[2];
                DLog.e(`Test Fail: Observed:<${observed}>, expected:<${expected}> at ${loc.trim()}`)
            }
            this.f_count++
        }
    }
    public report() {
        DLog.i(`
               
    -----------------------------------------------
        U T report
    -----------------------------------------------
    Total TC: ${this.p_count+ this.f_count}
    Passed: ${this.p_count}
    Failed: ${this.f_count}
    -----------------------------------------------
    `)
    }
}
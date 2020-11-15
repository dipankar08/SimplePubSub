export namespace dlog {
    export function d(msg:any){
        console.log(`[DEBUG] ${JSON.stringify(msg)}`)
    }

    export function e(msg:any){
        console.log(`[ERROR] ${JSON.stringify(msg)}`)
    }

    export function i(msg:any){
        console.log(`[INFO ] ${JSON.stringify(msg)}`)
    }
    export function trace(){

    }
    export function err(err:Error){
        console.log(err.stack)
    }

}
export namespace DTypes {
    export function isTrue(s:any){
        return (s == 'true' || s == true || s == 'True' || s == 'TRUE')
    }
    export function isFalse(s:any){
        return (s == 'false' || s == false || s == 'False' || s == 'FALSE')
    }
}

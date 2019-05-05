export function enumToArray(enums: any): string[] {
  let enumArr: string[] = [];
  for (let e in enums) {
    enumArr.push(e);
  }
  return enumArr;
}

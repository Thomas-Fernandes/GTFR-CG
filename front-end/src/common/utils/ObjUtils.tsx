export const isEmpty = (passedContext?: object) => {
  return passedContext === undefined
    || passedContext === null
    || Object.keys(passedContext).length === 0
  ;
}
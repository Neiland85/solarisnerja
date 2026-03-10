export function queueAlert(queueSize:number){

  if(queueSize > 500){
    return {
      level:"critical",
      message:"queue overload risk"
    }
  }

  if(queueSize > 200){
    return {
      level:"warning",
      message:"queue pressure detected"
    }
  }

  return {
    level:"normal",
    message:"queue healthy"
  }

}

import { processLeadQueue } from "./leadWorker"

let started = false

export function startQueueDaemon(){

  if(started){
    return
  }

  started = true

  setInterval(() => {

    try{

      processLeadQueue()

    }catch(e){

      console.error("queue daemon error",e)

    }

  },2000)

}

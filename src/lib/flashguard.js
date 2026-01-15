import { redis } from "./redis";

const flashguard = async (key,fetchFunction, useShield = true)=>{
   const lockKey = `lock:${key}`;
   const cacheKey = `data:${key}`;
   const start = Date.now();

   if(!useShield){
     try{
        const data = await fetchFunction();
        return {
           data, source:'DATABASE_UNPROTECTED'
        };
     }catch(err){
        throw new Error("Database Crash : System Overloaded");
     }
   }
   while(Date.now() - start < 2000){
     const cached = await redis.get(cacheKey);
     if(cached){
        return {
            data: cached,
            source: 'CACHE'
        };
     }
     const isLeader = await redis.set(lockKey, 'locked',{nx:true, ex:5});

     if(isLeader == "OK"){
        try{
            const data = await fetchFunction();

            await redis.set(cacheKey,data,{ex:60});
            return {
                data,
                source:'DATABASE'
            };
        }catch(err){
            await redis.del(lockKey);
            console.error("Critical error : ",err);
            continue;
        }
     }
     await new Promise(res=>setTimeout(res,50));
   }
   throw new Error("System Timeout: Unable to recover");
}

export default flashguard;
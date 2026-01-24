import { FlashGuard,RedisDriver } from "@asad-ahmed-saiyed/flashguard";
import Redis from "ioredis";

const globalForRedis = global;
if(!globalForRedis.redis){
    globalForRedis.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
}
const redis = globalForRedis.redis;
const driver = new RedisDriver(redis);

const guard = new FlashGuard(driver);

export default guard;

guard.on("hit", (key) => console.log(`Cache HIT: ${key}`));
guard.on("miss", (key) => console.log(`Cache MISS (Fetching DB): ${key}`));
guard.on("coalesced", (key) => console.log(`COALESCED (Saved DB Call): ${key}`));
guard.on("swr", (key) => console.log(`Stale Return (Background Update): ${key}`));
guard.on("circuit-tripped", () => console.log(`CIRCUIT OPEN! Redis is dead.`));
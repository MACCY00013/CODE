import asyncio, os
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from .sync import run_sync

async def sync():
    result = await run_sync()
    print("CareerOS sync:", result)

def main():
    loop = asyncio.new_event_loop(); asyncio.set_event_loop(loop)
    scheduler = AsyncIOScheduler(event_loop=loop)
    scheduler.add_job(sync, "interval", minutes=int(os.getenv("SYNC_INTERVAL_MINUTES", "15")), max_instances=1)
    scheduler.start()
    loop.run_until_complete(sync())
    loop.run_forever()

if __name__ == "__main__": main()

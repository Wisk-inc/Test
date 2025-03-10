
import discord
from discord.ext import commands

intents = discord.Intents.default()
intents.typing = False
intents.presences = False
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    hi_counter = 0
    if message.content.lower() == 'hi':
        while hi_counter < 5:
            await message.channel.send('Hi')
            hi_counter += 1

    await bot.process_commands(message)

TOKEN = 'MTMzODU5NDYzNzIyODU0NDAxMQ.GXO-qV.qvciycLyBQrusezmtyUlzaOWcdQBeSgqx-FlSI'
bot.run(TOKEN)

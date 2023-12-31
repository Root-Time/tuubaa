import { Client, Guild, Role } from "discord.js";
import config from "../../config/index";
import error from "../error";
import { client } from "../../bot";


export let guild: Guild


function getGuild() {
  if (!client) {
    error.messages.client_is_null()
    return null
  }

  const guild = client.guilds.cache.get(config.guild);

  if (!guild) {
    error.messages.guild_not_found_via_client()
    return null
  }

  return guild;
}


export function loadGuild() {
  guild = getGuild()!
}
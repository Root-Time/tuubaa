import {
  AttachmentBuilder,
  Client,
  Events,
  GuildMember,
  Message,
} from "discord.js";
import { createImage } from "./create";
import { channel } from "diagnostics_channel";
import { channels } from "../../lib/get_objects/channels";
import { Modules } from "../../lib/commands";
import { log } from "console";
import { roles } from "../../lib/get_objects/roles";

export default {
  run,
  commands: [],
} as Modules;

async function run(client: Client) {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.content === "!test") {
      const image = await createImage(message.author);

      log(image);

      await message.channel.send({ files: [image] });
    }
  });

  client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    const channel = channels.welcome;

    member.roles.add(roles.default);

    const image = await createImage(member.user);

    await channel.send({ files: [image] });
  });
}

// Level System

import { Colors, EmbedBuilder, GuildMember } from "discord.js";
import { channels } from "../../lib/get_objects/channels";
import { Level } from ".";
import config from "../../config";

export const LevelUp = {
  xp: addXP,
  embed: levelUpEmebd,
};

async function addXP(member: GuildMember, amount: number) {
  if (member.user.bot) return;

  // console.log(amount)
  const levelData = await Level.database.get(member.id);

  if (!levelData) {
    await Level.database.set(member.id, amount, 1);
    await channels.bot.send({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setTitle("Level Aufstieg!")
          .setDescription(
            `${member}. Du hast deine erste Nachricht geschrieben!\nDu bist nun \n**Level: 1**`
          ),
      ],
    });
    return;
  }

  let level = levelData.lvl;
  const xp = fix(levelData.xp + amount);

  const threshold = fix(
    level ** config.level.exponent * config.level.multiplikator
  );

  if (xp < threshold) {
    await Level.database.set(member.id, xp, level);
    return;
  }
  const newLevel = level + 1;
  const newXp = fix(xp - threshold);

  await Level.database.set(member.id, newXp, newLevel);
  await levelUp(member, newLevel);
}

function fix(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

function levelUpEmebd(member: GuildMember, level: number) {
  return new EmbedBuilder()
    .setTitle("Level Aufstieg!")
    .setColor(Colors.Green)
    .setDescription(
      `${member} hat das nächste Level erreicht!\n**Level: ${level}**`
    )
    .setFooter({
      text: member.displayName,
      iconURL: member.displayAvatarURL(),
    });
  // .setImage(guild.iconURL())
  // .setThumbnail(guild.iconURL())
}

async function levelUp(member: GuildMember, level: number) {
  await channels.bot.send({ embeds: [levelUpEmebd(member, level)] });
}

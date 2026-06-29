// frontend/src/components/helpers.js

// Helper to resolve team logos from public folder, falling back to PandaScore CDN
export const getTeamLogo = (team) => {
  const name = team.name;
  if (name === "Karmine Corp" || name === "Karmine") return "/logos/Teams/KC.png";
  if (name === "Fnatic") return "/logos/Teams/Fnatic.png";
  if (name === "G2 Esports" || name === "G2") return "/logos/Teams/G2.png";
  if (name === "GiantX") return "/logos/Teams/GiantX.png";
  if (name === "MKOI") return "/logos/Teams/MKOI.png";
  if (name === "Natus Vincere" || name === "Navi") return "/logos/Teams/Natus_Vincere.png";
  if (name === "Shifters") return "/logos/Teams/Shifters.png";
  if (name === "SK Gaming" || name === "SK") return "/logos/Teams/SK_Gaming.png";
  if (name === "Team Heretics" || name === "Heretics") return "/logos/Teams/Team_Heretics.png";
  if (name === "Vitality" || name === "Team Vitality") return "/logos/Teams/Vitality.png";
  
  return team.image_url;
};

// Helper to resolve game logos
export const getGameLogo = (slug, name) => {
  const game = slug?.toLowerCase() || name?.toLowerCase() || '';
  if (game.includes('cs-go') || game.includes('cs-2') || game.includes('counter-strike')) return '/logos/CSGO/CSGO.png';
  if (game.includes('league-of-legends') || game.includes('lol')) return '/logos/League of Legends/League_of_Legends.png';
  if (game.includes('valorant')) return '/logos/Valorant/Valorant.png';
  if (game.includes('dota-2') || game.includes('dota2')) return '/logos/Dota 2/DOTA_2.png';
  if (game.includes('r6') || game.includes('rainbow-six') || game.includes('rainbow6')) return '/logos/Rainbow 6 Siege/R6.png';
  return null;
};

// Helper to map player name to local headshot
export const getPlayerImage = (player) => {
  const name = player.name?.toLowerCase() || player.nickname?.toLowerCase() || '';
  if (name.includes('canna')) return '/logos/Joueurs/canna.webp';
  if (name.includes('skewmond')) return '/logos/Joueurs/skewmond.webp';
  if (name.includes('kyeahoo') || name.includes('kyaehoo') || name.includes('vladi')) return '/logos/Joueurs/kyeahoo.webp';
  if (name.includes('caliste')) return '/logos/Joueurs/caliste.webp';
  if (name.includes('busio')) return '/logos/Joueurs/busio.webp';
  if (name.includes('brokenblade') || name.includes('broken-blade') || name.includes('broken blade')) return '/logos/Joueurs/brokenblade.webp';
  if (name.includes('yike')) return '/logos/Joueurs/yike.webp';
  if (name.includes('caps')) return '/logos/Joueurs/caps.webp';
  if (name.includes('hans-sama') || name.includes('hans sama') || name.includes('hans')) return '/logos/Joueurs/hans-sama.webp';
  if (name.includes('labrov')) return '/logos/Joueurs/labrov.webp';
  
  return player.image_url || '/logos/Joueurs/default.png'; 
};

// Helper to map role to icon
export const getRoleIcon = (roleName) => {
  const role = roleName?.toLowerCase() || '';
  if (role.includes('top')) return '/logos/Roles/Top.png';
  if (role.includes('jungle') || role.includes('forestier') || role === 'jun') return '/logos/Roles/Forestier.png';
  if (role.includes('mid') || role.includes('midlaner')) return '/logos/Roles/Midlaner.png';
  if (role.includes('adc') || role.includes('bot') || role.includes('tireur')) return '/logos/Roles/Tireur.png';
  if (role.includes('support') || role === 'sup') return '/logos/Roles/Support.png';
  return null;
};

// Helper to translate roles for display
export const translateRole = (roleName) => {
  const role = roleName?.toLowerCase() || '';
  if (role.includes('top')) return 'Top';
  if (role.includes('jungle') || role.includes('forestier') || role === 'jun') return 'Jungle';
  if (role.includes('mid') || role.includes('midlaner')) return 'Mid';
  if (role.includes('adc') || role.includes('bot') || role.includes('tireur')) return 'ADC';
  if (role.includes('support') || role === 'sup') return 'Support';
  return roleName;
};

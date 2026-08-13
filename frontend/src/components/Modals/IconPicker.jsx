import React, { useState } from 'react';
import { Smile, Sparkles, ChevronDown, ChevronUp, Search, Globe, Link, Cpu, Server, Check } from 'lucide-react';
import RenderIcon from '../RenderIcon';

export const QUICK_PRESETS = ['📁', '⚡', '🍿', '🔐', '🛠️', '🎮', '📚', '🌐', '💼', '🎵', '🏠', '🎨', '🚀', '⭐', '🔥', '💻'];

export const SELFHST_ICONS = [
  { name: 'Plex', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/plex.svg' },
  { name: 'Jellyfin', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/jellyfin.svg' },
  { name: 'Home Assistant', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/home-assistant.svg' },
  { name: 'Portainer', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/portainer.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/docker.svg' },
  { name: 'Sonarr', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/sonarr.svg' },
  { name: 'Radarr', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/radarr.svg' },
  { name: 'Prowlarr', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/prowlarr.svg' },
  { name: 'Overseerr', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/overseerr.svg' },
  { name: 'Nextcloud', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/nextcloud.svg' },
  { name: 'Pi-hole', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/pi-hole.svg' },
  { name: 'AdGuard Home', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/adguard-home.svg' },
  { name: 'Vaultwarden', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/vaultwarden.svg' },
  { name: 'Bitwarden', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/bitwarden.svg' },
  { name: 'Transmission', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/transmission.svg' },
  { name: 'qBittorrent', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/qbittorrent.svg' },
  { name: 'Grafana', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/grafana.svg' },
  { name: 'Prometheus', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/prometheus.svg' },
  { name: 'Uptime Kuma', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/uptime-kuma.svg' },
  { name: 'Immich', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/immich.svg' },
  { name: 'Paperless-ngx', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/paperless-ngx.svg' },
  { name: 'Nginx Proxy Manager', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/nginx-proxy-manager.svg' },
  { name: 'Traefik', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/traefik.svg' },
  { name: 'Tailscale', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/tailscale.svg' },
  { name: 'WireGuard', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/wireguard.svg' },
  { name: 'Mealie', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/mealie.svg' },
  { name: 'Audiobookshelf', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/audiobookshelf.svg' },
  { name: 'Calibre-Web', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/calibre-web.svg' },
  { name: 'Wallabag', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/wallabag.svg' },
  { name: 'Proxmox', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/proxmox.svg' },
  { name: 'Unraid', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/unraid.svg' },
  { name: 'TrueNAS', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/truenas.svg' },
  { name: 'Syncthing', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/syncthing.svg' },
  { name: 'Homebridge', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/homebridge.svg' },
  { name: 'Photoprism', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/photoprism.svg' },
  { name: 'Frigate', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/frigate.svg' },
  { name: 'Netdata', icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/netdata.svg' }
];

export const TECH_ICONS = [
  { name: 'React', icon: 'https://cdn.simpleicons.org/react' },
  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs' },
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python' },
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript' },
  { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
  { name: 'Vue.js', icon: 'https://cdn.simpleicons.org/vuedotjs' },
  { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs' },
  { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
  { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker' },
  { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes' },
  { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux' },
  { name: 'Ubuntu', icon: 'https://cdn.simpleicons.org/ubuntu' },
  { name: 'Debian', icon: 'https://cdn.simpleicons.org/debian' },
  { name: 'Raspberry Pi', icon: 'https://cdn.simpleicons.org/raspberrypi' },
  { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql' },
  { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql' },
  { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb' },
  { name: 'Nginx', icon: 'https://cdn.simpleicons.org/nginx' },
  { name: 'Apache', icon: 'https://cdn.simpleicons.org/apache' },
  { name: 'Cloudflare', icon: 'https://cdn.simpleicons.org/cloudflare' },
  { name: 'AWS', icon: 'https://cdn.simpleicons.org/amazonaws' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github' },
  { name: 'GitLab', icon: 'https://cdn.simpleicons.org/gitlab' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/visualstudiocode' },
  { name: 'Postman', icon: 'https://cdn.simpleicons.org/postman' },
  { name: 'Git', icon: 'https://cdn.simpleicons.org/git' },
  { name: 'Rust', icon: 'https://cdn.simpleicons.org/rust' },
  { name: 'Go', icon: 'https://cdn.simpleicons.org/go' },
  { name: 'PHP', icon: 'https://cdn.simpleicons.org/php' },
  { name: 'Laravel', icon: 'https://cdn.simpleicons.org/laravel' },
  { name: 'WordPress', icon: 'https://cdn.simpleicons.org/wordpress' },
  { name: 'Discord', icon: 'https://cdn.simpleicons.org/discord' },
  { name: 'Steam', icon: 'https://cdn.simpleicons.org/steam' },
  { name: 'Twitch', icon: 'https://cdn.simpleicons.org/twitch' },
  { name: 'YouTube', icon: 'https://cdn.simpleicons.org/youtube' },
  { name: 'Spotify', icon: 'https://cdn.simpleicons.org/spotify' }
];

export const CATEGORIZED_ICONS = [
  {
    category: 'Quick Favorites',
    icon: '⭐',
    items: ['📁', '⚡', '🍿', '🔐', '🛠️', '🎮', '📚', '🌐', '💼', '🎵', '🏠', '🎨', '🚀', '⭐', '🔥', '💻']
  },
  {
    category: 'Tech & Hardware',
    icon: '💻',
    items: ['💻', '🖥️', '⚡', '⚙️', '🛠️', '🤖', '🌐', '📦', '🔒', '🔑', '💾', '📱', '📡', '☁️', '📊', '🔌', '⌨️', '🖱️', '🖨️']
  },
  {
    category: 'Media & Entertainment',
    icon: '🍿',
    items: ['🍿', '🎬', '🎵', '🎧', '📻', '📺', '📷', '🎨', '🎟️', '🎶', '🎙️', '🔊', '🎥', '🖼️', '🎸', '🎺', '🎹', '🥁', '📽️']
  },
  {
    category: 'Work & Productivity',
    icon: '💼',
    items: ['💼', '📚', '📝', '📅', '📈', '📊', '📧', '📌', '🏷️', '📂', '📋', '✏️', '🖊️', '🗂️', '📁', '🗄️', '⏳']
  },
  {
    category: 'Social & Chat',
    icon: '💬',
    items: ['💬', '🌐', '👥', '📣', '💌', '📢', '🤝', '❤️', '⭐', '🔔', '📬', '🗣️', '💭', '📱', '✉️']
  },
  {
    category: 'Gaming & Fun',
    icon: '🎮',
    items: ['🎮', '🕹️', '🎲', '🎯', '🏆', '👾', '🧩', '🃏', '⚔️', '🛡️', '🚀', '✨', '👑', '🔮']
  },
  {
    category: 'Health, Life & D&D',
    icon: '🩺',
    items: ['❤️', '🩺', '💊', '🏃', '🥗', '🧘', '🐉', '🏰', '📜', '⚔️', '🛡️', '🧙', '🔮', '🪙', '🌿', '🍎', '💧', '☀️', '🌙']
  }
];

export default function IconPicker({ selectedIcon, onSelectIcon }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('selfhst'); // 'selfhst', 'tech', 'emoji', 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const handleFetchFavicon = () => {
    if (!customUrlInput.trim()) return;
    try {
      let domain = customUrlInput.trim();
      if (domain.startsWith('http')) {
        domain = new URL(domain).hostname;
      }
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      onSelectIcon(faviconUrl);
    } catch (e) {
      onSelectIcon(customUrlInput.trim());
    }
  };

  const filteredSelfhst = SELFHST_ICONS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTech = TECH_ICONS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-sky-400" /> Icon Selection
        </label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/30 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Hide Full Library' : 'Browse selfh.st & techicons (100+ Icons)'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Selected Icon Active Badge / Quick Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-lg flex-shrink-0">
          <RenderIcon icon={selectedIcon} defaultIcon="⭐" className="w-5 h-5 object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-400 block truncate">Current Selected Icon:</span>
          <span className="text-xs font-bold text-sky-300 truncate block">
            {selectedIcon ? (selectedIcon.startsWith('http') ? 'Custom / Web SVG Icon' : selectedIcon) : 'Default Icon'}
          </span>
        </div>

        {/* Quick Emoji Bar */}
        <div className="hidden sm:flex items-center gap-1 overflow-x-auto">
          {QUICK_PRESETS.slice(0, 7).map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => onSelectIcon(em)}
              className={`p-1 rounded-lg text-sm hover:bg-slate-800 transition ${
                selectedIcon === em ? 'bg-sky-500/20 border border-sky-400' : ''
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Icon Libraries Modal Box */}
      {isExpanded && (
        <div className="p-3.5 bg-slate-950/95 border border-slate-800 rounded-2xl space-y-3 animate-fadeIn shadow-2xl">
          {/* Library Source Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('selfhst')}
              className={`flex-1 min-w-[100px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'selfhst'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>selfh.st Icons</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tech')}
              className={`flex-1 min-w-[100px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'tech'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>techicons.dev</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('emoji')}
              className={`flex-1 min-w-[90px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'emoji'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Emojis</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 min-w-[90px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'custom'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Custom URL</span>
            </button>
          </div>

          {/* Search Bar (For Selfh.st, Tech, and Emoji tabs) */}
          {activeTab !== 'custom' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search icons by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-400"
              />
            </div>
          )}

          {/* TAB 1: Selfh.st Icons */}
          {activeTab === 'selfhst' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredSelfhst.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onSelectIcon(item.icon)}
                  className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-400/60 hover:bg-slate-800 transition flex flex-col items-center gap-1.5 group ${
                    selectedIcon === item.icon ? 'border-sky-400 bg-sky-500/10' : ''
                  }`}
                  title={item.name}
                >
                  <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-slate-300 truncate w-full text-center">{item.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 2: TechIcons.dev */}
          {activeTab === 'tech' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredTech.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onSelectIcon(item.icon)}
                  className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-400/60 hover:bg-slate-800 transition flex flex-col items-center gap-1.5 group ${
                    selectedIcon === item.icon ? 'border-sky-400 bg-sky-500/10' : ''
                  }`}
                  title={item.name}
                >
                  <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold text-slate-300 truncate w-full text-center">{item.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: Emoji Library */}
          {activeTab === 'emoji' && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {CATEGORIZED_ICONS.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">{cat.category}</span>
                  <div className="grid grid-cols-8 gap-1">
                    {cat.items.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => onSelectIcon(em)}
                        className={`p-1.5 rounded-lg text-base hover:bg-slate-800 transition flex items-center justify-center ${
                          selectedIcon === em ? 'bg-sky-500/20 border border-sky-400' : ''
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Custom Image URL / Auto-Fetch Favicon */}
          {activeTab === 'custom' && (
            <div className="space-y-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Direct SVG / Image URL or Web Address</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="e.g. https://plex.tv or https://site.com/logo.svg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-500 text-xs outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFavicon}
                    className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Globe className="w-3.5 h-3.5" /> Fetch Icon
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                Paste any website address (e.g. <code>github.com</code> or <code>https://selfh.st</code>) to fetch its high-res favicon automatically, or paste a direct <code>.svg</code> / <code>.png</code> URL.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

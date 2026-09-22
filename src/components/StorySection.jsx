import React from 'react';
import { Heart, Calendar, MessageCircleHeart, Sparkles } from 'lucide-react';
import { BotanicalDivider, CornerFiligree } from './Ornaments';

export default function StorySection({ stories }) {
  const storyIcons = [
    <MessageCircleHeart key="1" size={22} />,
    <Heart key="2" size={22} />,
    <Sparkles key="3" size={22} />
  ];

  // Curated authentic prewedding milestone replacement photos
  const milestonePhotos = [
    {
      src: '/assets/images/4.jpeg',
      subtitle: 'Awal Perjumpaan yang Membawa Cerita Baru'
    },
    {
      src: '/assets/images/8.jpeg',
      subtitle: 'Takdir Mempertemukan Kembali & Mengikat Kesetiaan'
    },
    {
      src: '/assets/images/10.jpeg',
      subtitle: 'Cincin Pengikat Kasih & Satu Tekad Menuju Altar Kudus'
    }
  ];

  return (
    <section 
      id="story" 
      className="section section-dark section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/25.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">LOVE STORY</p>
          <h2 className="section-title">Kisah Perjalanan Kasih</h2>
          <BotanicalDivider />
          <p className="gallery-subtitle">
            Setiap detik yang kami lalui adalah untaian doa dan anugerah Tuhan
          </p>
        </div>

        <div className="story-timeline reveal">
          <div className="story-line"></div>

          {stories.map((story, index) => {
            const isLeft = index % 2 === 0;
            const photoData = milestonePhotos[index % milestonePhotos.length];

            return (
              <div 
                key={index} 
                className={`story-item ${isLeft ? 'story-left' : 'story-right'}`}
              >
                {/* Milestone Glowing Node */}
                <div className="story-node">
                  <div className="story-node-pulse"></div>
                  <div className="story-node-circle">
                    {storyIcons[index % storyIcons.length]}
                  </div>
                </div>

                {/* Content Card with Non-Inspectable Pure Visual Photo */}
                <div className="story-card">
                  <CornerFiligree position="top-left" />
                  <CornerFiligree position="bottom-right" />

                  {/* Photo Frame Container (Non-clickable, no inspect) */}
                  <div className="story-card-photo-box unselectable-photo">
                    <img 
                      src={photoData.src} 
                      alt={story.title} 
                      className="story-card-img non-inspectable-img"
                      loading="lazy" 
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="story-card-photo-overlay"></div>
                    <div className="story-chapter-pill">
                      <span>BAB 0{index + 1}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="story-card-body">
                    <div className="story-badge">
                      <Calendar size={13} />
                      <span>{story.year}</span>
                    </div>
                    <h3 className="story-title">{story.title}</h3>
                    {photoData.subtitle && (
                      <p className="story-subtitle">{photoData.subtitle}</p>
                    )}
                    <p className="story-desc">{story.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

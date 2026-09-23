import React from 'react';
import { Heart, Calendar, MessageCircleHeart, Sparkles } from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';

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
          <GorgaBatakOrnament size={44} />
          <UlosRibbonDivider />
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

                {/* Milestone Content Card */}
                <div className="story-card">
                  {/* Authentic Batak Gorga Corner Accents */}
                  <CornerGorgaFiligree position={isLeft ? 'top-left' : 'top-right'} />
                  
                  {/* Photo Banner with Protected Non-Inspectable Image */}
                  <div className="story-card-photo-wrapper">
                    <img 
                      src={photoData.src} 
                      alt={story.title} 
                      className="story-card-img non-inspectable-img"
                      loading="lazy"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <div className="story-card-photo-overlay"></div>
                    <span className="story-chapter-pill">CHAPTER 0{index + 1}</span>
                  </div>

                  {/* Card Content Body */}
                  <div className="story-card-body">
                    <div className="story-badge">
                      <Calendar size={13} />
                      <span>{story.year}</span>
                    </div>

                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-subtitle">{photoData.subtitle}</p>
                    <p className="story-desc">{story.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <UlosRibbonDivider className="mt-8" />
      </div>
    </section>
  );
}

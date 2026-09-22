import React from 'react';
import { Heart, Calendar, MessageCircleHeart, Sparkles } from 'lucide-react';

export default function StorySection({ stories }) {
  const storyIcons = [
    <MessageCircleHeart key="1" size={24} />,
    <Heart key="2" size={24} />,
    <Sparkles key="3" size={24} />
  ];

  return (
    <section id="story" className="section section-dark">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Perjalanan Cinta Kami</p>
          <h2 className="section-title">Kisah Cinta</h2>
          <div className="ornament-line"></div>
        </div>

        <div className="story-timeline reveal">
          <div className="story-line"></div>

          {stories.map((story, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`story-item ${isLeft ? 'story-left' : 'story-right'}`}
              >
                {/* Milestone Node */}
                <div className="story-node">
                  <div className="story-node-circle">
                    {storyIcons[index % storyIcons.length]}
                  </div>
                </div>

                {/* Content Card */}
                <div className="story-card glass-card">
                  <div className="story-badge">
                    <Calendar size={13} />
                    <span>{story.year}</span>
                  </div>
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-desc">{story.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

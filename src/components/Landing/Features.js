import React, {useState, useEffect, useRef}from 'react';
import { Row, Col } from 'antd';
import sorted from '../../assets/image/sorted.jpg';
import search from '../../assets/image/search.jpg';
import screenshotdark from '../../assets/image/screenshotdark.jpg';
import explore from '../../assets/image/explore.jpg';
import sjtu from '../../assets/image/sjtu.jpg';
import multimedia from '../../assets/image/multimedia.jpg';

const FeatureBlock = ({ imgSrc, title, description, imgWidth = '270px', imgHeight = '180px', delay=0}) => {
    const [hovered, setHovered] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const blockRef = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setRevealed(true);
                    observer.disconnect(); // stop observing after block is revealed
                }
            },
            { threshold: 0.1 } // trigger when 10% of the block is visible
        );
    
        if (blockRef.current) {
            observer.observe(blockRef.current);
        }
    
        return () => observer.disconnect(); // clean up observer on unmount
    }, []);

    return (
        <Col span={8}  ref={blockRef}
            style={{ 
                textAlign: 'center', 
                position: 'relative',
                display:'flex', 
                flexDirection:'column', 
                justifyContent:'center',
                opacity: revealed ? 1 : 0,
                transform: `translateY(${revealed ? '0' : '50px'})`,
                transition: `opacity 0.5s ${delay}s, transform 0.5s ${delay}s`
            }} 
        >
            <div style={{
                position: 'relative',
                width: imgWidth,
                height: imgHeight,
                margin: 'auto',
            }}>
                {/* Image */}
                <img 
                    src={imgSrc} 
                    alt={title} 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        transition: 'filter 0.5s',
                        filter: hovered ? 'blur(4px)' : 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                    }} 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                />

                {/* Description */}
                <div 
                    style={{ 
                        position: 'absolute', 
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        backgroundColor: 'rgba(0,0,0,0.1)', 
                        opacity: hovered ? '1' : '0', 
                        transition: 'opacity 0.3s', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        pointerEvents: 'none',
                        color: '#8c8c8c',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        textAlign: 'center',
                        zIndex: 2
                    }}
                >
                    {description}
                </div>
            </div>
            
            <h3 style={{ fontSize: '20px', marginBottom: '50px', }}>{title}</h3>
        </Col>
    );
}


const Features = () => {
    const featuresData = [
        { imgSrc: sorted, title: 'Organized and Sorted', 
            description: 'Tag-based subscription management keeps all your feeds tidy and clear.' },
        { imgSrc: search, title: 'Search What You Want', 
            description: 'Lookup articles by title or content to quickly find what interests you.' },
        { imgSrc: screenshotdark, title: 'Day and Night Reading', 
            description: 'Switch freely between dark and light modes for ultimate reading comfort.' },
        { imgSrc: explore, title: 'Discover New Horizons', 
            description: 'Explore page connects you to quality platforms and academic journals.' },
        { imgSrc: sjtu, title: 'Campus Life Simplified', 
            description: 'Custom SJTU campus feeds tailored for students to stay up-to-date.' },
        { imgSrc: multimedia, title: 'Beyond Text, Multimedia', 
            description: 'Enrich your feeds with support for videos and music.' },
    ];

    return (
        <div style={{ padding: '50px 0', textAlign: 'center', backgroundColor: '#fff' }}>
            <h2 style={{ fontSize: '45px', color: '#333', marginBottom: '20px' }}>Discover the Smarter Way to Read</h2>
            <p style={{ fontSize: '22px', color: '#777', marginBottom:'50px' }}>
                The features that make our RSS reader the best choice   for staying informed.</p>
            <Row gutter={[32, 50]} style={{ margin: 20 }}> {/* Changed gutter for vertical spacing */}
                {featuresData.map((feature, idx) => (
                    <FeatureBlock key={idx} {...feature} delay={idx * 0.1}/>
                ))}
            </Row>
        </div>
    );
}

export default Features;
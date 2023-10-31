import React, {useState, useEffect, useRef}from 'react';import { Row, Col } from 'antd';
import beacox from '../../assets/image/beacox.jpg';
import wytili from '../../assets/image/wytili.jpg';
import sora from '../../assets/image/sora.jpg';
import gaoi from '../../assets/image/gaoi.jpg';

const TeamMember = ({ imgSrc, name, role, link, delay=0}) => {
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
        <Col span={4}  ref={blockRef}
            style={{ 
                textAlign: 'center',
                opacity: revealed ? 1 : 0,
                transform: `translateY(${revealed ? '0' : '50px'})`,
                transition: `opacity 0.5s ${delay}s, transform 0.5s ${delay}s`
            }} 
        >
            <a href={link} target="_blank" rel="noopener noreferrer">
                <img src={imgSrc} alt={name} style={{ borderRadius: '50%', width: '160px'}} />
            </a>
            <h3 style={{fontSize:'25px', marginBottom:'0'}}>{name}</h3>
            <p style={{fontSize:'20px', margin:'5px 0 5px 0'}}>{role}</p>
        </Col>
    );
}

const Team = () => {
    const teamData = [
        { imgSrc: beacox, name: 'Beacox', role: 'Back-end', link: 'https://www.beacox.space/' },
        { imgSrc: wytili, name: 'Wytili', role: 'Front-end', link: 'https://github.com/wytili' },
        { imgSrc: sora, name: 'Sora', role: 'Front-end', link: 'https://github.com/Sora-Yanl' },
        { imgSrc: gaoi, name: 'G-AOi', role: 'Back-end', link: 'https://github.com/G-AOi' }
    ];
    

    return (
        <div style={{ minHeight:'60vh', padding: '50px 0', textAlign: 'center' ,backgroundColor:'#f7f7f7'}}>
            <h2 style={{ fontSize: '45px', color: '#333', marginBottom: '50px' }}>Meet Our Team</h2>
            <Row gutter={2} style={{ margin: 0 }} justify={'center'}>
                {teamData.map((member, idx) => (
                        <TeamMember key={idx} {...member} delay={idx * 0.1}/>
                ))}
            </Row>
        </div>
    );
}

export default Team;

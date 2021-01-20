import React from 'react';
import '../components/CategoryUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CategoryUser(props) {
    const style ={
        display:'flex',
        justifyContent:'center',
        width: '30px',
        height: 'auto',
        padding: '20px',
        marginRight: '30px',
        borderRadius: '13px',
        backgroundColor: 'rgb(249, 53, 169)',
        color: '#fff',
        fontSize: '2em',
        backgroundColor: props.bgColor
    }
    const titleStyle={
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline'
    }
    const scaleTitleStyle ={
        transform: 'scale(1.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline'
    }
    return (
        <div 
          style={props.scale ? scaleTitleStyle: titleStyle } 
          className={props.title.split(" ").join("")} 
        >

            <div  style={style}>{<FontAwesomeIcon icon={props.icon}/>}</div>
            <p className="category_name">{props.title}</p>
        </div>
    )
}

export default CategoryUser

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import '../components/User.css';

function User(props) {

    function clicked(){
        props.parentCallBack(props);
    }
 
    return (
        <div className="user__inner">
            <div className="user__img">
                <img src={props.img} alt="user_img"/>
            </div>
            <div className="user__details">
                <h2 className="user__fullname">{props.name}</h2>
                <p className="user__street">{props.address}</p>
                <div className="user__contact">
                    <p><span><FontAwesomeIcon icon={props.emailIcon}/></span> {props.email}</p>
                    <p><span><FontAwesomeIcon icon={props.phoneIcon}/></span> {props.phone}</p>
                    {props.reveal === true
                        && <button onClick={clicked}><FontAwesomeIcon icon={faArrowRight}/></button>
                    }
                    
                </div>
                
            </div>
        </div>
    )
}

export default User

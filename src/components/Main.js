import React, {useEffect, useState} from 'react';
import '../components/Main.css';
import CategoryUser from '../components/CategoryUser';
import User from '../components/User';
import {faSearch,faUsers, faMale, faFemale,faPhoneAlt,faAngleLeft, faAngleRight,faEnvelope, faArrowLeft, faMobileAlt, faRedoAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from "react-switch";
import Particles from 'react-particles-js';


function Main(props) {
    
    const [buttonSwitch, setButtonSwitch] = useState({checked: false});
    const [users, setUsers] = useState([])
    const [scale, setScale] = useState({one:false, two:false, three:false});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentGender, setCurrentGender] = useState('');
    const [paginate, setPaginate] = useState(0);
    const [initialData, setInitialData] = useState(true);
    const [showSingle, setShowSingle] = useState(false)
    let getName = localStorage.getItem("formName");
    const [formName, setFormName] = useState(getName ? JSON.stringify(getName) : '');
    const [name, setName] = useState("");
    const [formCorrect, setformCorrect] = useState(false);
    const [singleUserData, setSingleUserData]= useState();
    const [dropDownItem, setDropDownItem] = useState("");
    const [searchFilter, setSearchFilter] = useState("");
    const [getFilteredUser, setFilteredUser] = useState({available:false, user: ''});
    const [reload, setReload] = useState(false);



    useEffect(()=>{
        if (searchFilter.length === 0){
            return setFilteredUser({available:false, user:''});
        };
        if (!users.length) return;
        
        const filteredUser = users[0].results.find((user)=>{
            return `${user.name.title.toLowerCase()}
                    ${user.name.first.toLowerCase()} 
                    ${user.name.last.toLowerCase()}`.includes(searchFilter)
        })
        if (filteredUser !== undefined){
            setFilteredUser({available:true, user: filteredUser});
        }
        
    },[searchFilter])
    
    function handleButtonChange(checked){
        setButtonSwitch({checked});
    }

    //display something when user first load the page
    useEffect(()=>{
        if (paginate >= 1 ) return;
        setLoading(true);
        fetch("https://randomuser.me/api/?results=3")
        .then(res => res.json())
        .then(
            (result) => {
            setLoading(false);
            setUsers([result])
            setError(false);
            },
            (error) => {
            setLoading(false);
            setError('An Error Occured, please try again')
            console.log("theres error", error);
            }
        )
    },[reload])

    function getUser(gender){
        if (!typeof gender === 'string') return;
        let m = 'male';
        let f = 'female';
        let a = 'all';
        if(!gender === m || !gender === f || !gender === a) return;

        setCurrentGender(`${gender}`);
        function getUrl(){
            let url
            let countryCodeToLowerCase = dropDownItem.length > 0 && dropDownItem.toLowerCase();
            if(gender !== 'all'){

               url = `https://randomuser.me/api/?gender=${gender}&results=3${countryCodeToLowerCase.length === 2 ? `&nat=${countryCodeToLowerCase}` : ``}`;
                      console.log(currentGender)
                     
               return url;
                
            }
            else{ 
                url = `https://randomuser.me/api/?page=${paginate === 0 ? 1 : paginate}&results=3&seed=abc${countryCodeToLowerCase ? `&nat=${countryCodeToLowerCase}`: ``}`; 
                return url;
            }
        }
        setLoading(true); 
        fetch(getUrl())
        .then(res => res.json())
        .then(
            (result) => {
                setLoading(false);
                setError("");
                setUsers([result]);
                
            },
            (error) => {
                setLoading(false);
                setError('An Error Occured, please try again');
                return console.log(`${gender} user error`, error);
            }
        )

    }
    function handleCallBack(childData){

        setSingleUserData(childData);
        setShowSingle(true)
       
        
    }
    //these's where users and their details are generated
    const userList = users[0] && users[0].results.map((user)=>{
                    return <User parentCallBack={handleCallBack} 
                                key={user.login.uuid} img={user.picture.medium}
                                name={`${user.name.title}. ${user.name.first} ${user.name.last}`}
                                email={user.email}
                                phone={user.cell}
                                address={`${user.location.street.number}, ${user.location.street.name}`}
                                emailIcon={faEnvelope}
                                phoneIcon={faPhoneAlt}
                                registered={user.registered.date}
                                reveal={true}
                            />
                    })
  

    function handleGoBack(){
        setShowSingle(false);
    }
    let showNextStyles;
    showNextStyles = {opacity: showSingle ? '.4' :'1', cursor: showSingle ? 'not-allowed' : 'default'};

    // covert first letter to upper case 
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      }

    function saveFormName(){
        localStorage.setItem("formName", name);
        setformCorrect(true);
    }


    return (
        <>
        {!localStorage.getItem("formName") ?
         <div className="userForm" style={{transform: formCorrect ?'translateY(-50px)' : 'translateY(0px)'}}>
             { window.screen.width >= 1280 && <Particles /> }
             <div className="inputContainer">
                <h1>What's Your Name  ?</h1>
                <form onSubmit={(e)=>{e.preventDefault();  saveFormName(); }}> 
                    <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}} />
                </form>
             </div>
         </div> 
           : 
            <div className="container">
            <section className="side">
                <div className="side__top">
                    <h1 className="side__bigName">
                        Hello, <span className="side__userName">{localStorage.getItem('formName')}</span>
                    </h1>
                    <p className="side_desc">Welcome to your dashboard, kindly sort
                        through the user base
                    </p>
                </div>
                <div className="side__search">
                    <form>
                        <span className="search_icon">
                            <FontAwesomeIcon icon={faSearch}/>
                        </span>
                        <input type="text"
                        name="search" 
                        placeholder="Find a user"
                        />
                    </form>
                </div>
                <div className="side__bottom">
                    <h4>show users</h4>
                    <div className="side__icons" style={{display:"flex"}}>

                        <div className="f" 
                            onClick={()=>{
                                setScale({one: true, two:false, three:false });
                                getUser('all')
                            }}
                        >
                            <CategoryUser 
                            icon={faUsers} 
                            title="All Users" 
                            bgColor="#f935a9" 
                            scale={scale.one} 
                            />
                        </div>
                        <div className="f"
                            onClick={()=>{
                                setScale({two: true, one:false, three:false}); 
                                getUser('male')
                            }}
                        >
                            <CategoryUser 
                                icon={faMale} 
                                title="Male Users" 
                                bgColor="#30bbb5" 
                                scale={scale.two}
                            />
                        </div>
                        <div className="f" 
                            onClick={()=>{
                                setScale({three: true, two:false, one:false}); 
                                getUser('female')
                            }}
                        >
                            <CategoryUser 
                                icon={faFemale} 
                                title="Female Users" 
                                bgColor="#7946c1" 
                                scale={scale.three}
                            />
                        </div>
                    </div>
                </div>
                
            </section>

            <section className="mainPage" >
                <div className="mainPage__inner">
                    <h1 className="mainPage__bigCategory">
                        
                        {showSingle ? 'User List' : `${capitalize(currentGender)} Users` }
                    </h1>
                    <div className="mainPage__filterSearch">
                        <p>Filter by</p>
                        <div className="mainPage__top">
                            <form onSubmit={(e)=>{e.preventDefault()}}>
                                <span className="search_icon">
                                <FontAwesomeIcon icon={faSearch}/>
                                </span>
                                <input type="text" name="text" placeholder="Find in list" value={searchFilter} onChange={(e)=>{setSearchFilter(e.target.value)}} />


                            </form>
                            <div className="selectWrapper">
                                <select
                                    value={dropDownItem} 
                                    onChange={(e)=>setDropDownItem(e.target.value)}
                                >
                                    <option defaultValue value="Country">Country</option>
                                    <option value="AU">Australia</option>
                                    <option value="BR">Brazil</option>
                                    <option value="CA">Canada</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="DE">Germany</option>
                                    <option value="US">America</option>
                                </select>
                            </div>
                            <div className="switch">
                                <Switch 
                                    onColor='#30bbb5'
                                    handleDiameter={25}
                                    uncheckedIcon={false} 
                                    checkedIcon={false} 
                                    onChange={handleButtonChange} 
                                    checked={buttonSwitch.checked} 
                                />
                                <p>show Country</p>
                            </div>
                        </div>
                    </div>
                    {loading ? 
                        <div className="loading"><div className="loading__inner"></div></div>
                        :
                            error.length >0 ? <div className="error"> {error}  <button className="reloadButton" onClick={()=>{setReload(!reload)}}><span><FontAwesomeIcon icon={faRedoAlt}/></span>&nbsp;Reload</button></div>
                            : 
                                showSingle
                                    ?
                                    <div className="singlePage">
                                        <div 
                                            className="goBack" 
                                            onClick={handleGoBack}>
                                            <span>{<FontAwesomeIcon icon={faArrowLeft}/>}</span>&nbsp;RESULTS
                                        </div>
                                        <div className="singlePage__inner">
                                            <div className="singlePage__img"><img src={singleUserData.img} alt="single Img"/></div>
                                            <div className="singlePage__details">
                                                <h1>{singleUserData.name}</h1>
                                                <p className="single_address">{singleUserData.address}</p>
                                                <p className="single_email"><span><FontAwesomeIcon icon={faEnvelope}/></span> {singleUserData.email}</p>
                                                <p className="joined_date">JOINED: {singleUserData.registered.substr(0, 9)}</p>
                                                
                                                <p className="single_phone"><span><FontAwesomeIcon icon={faPhoneAlt}/></span>&nbsp; {singleUserData.phone}</p>
                                                <p className="single_phone"><span><FontAwesomeIcon icon={faMobileAlt}/></span>&nbsp; &nbsp;{singleUserData.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    
                                    
                                        getFilteredUser.available 
                                        ?
                                         <div className="searchFilterPage">
                                            <User
                                                img={getFilteredUser.user.picture.medium}
                                                name={`${getFilteredUser.user.name.title}. ${getFilteredUser.user.name.first} ${getFilteredUser.user.name.last}`}
                                                email={getFilteredUser.user.email}
                                                phone={getFilteredUser.user.cell}
                                                address={`${getFilteredUser.user.location.street.number}, ${getFilteredUser.user.location.street.name}`}
                                                emailIcon={faEnvelope}
                                                phoneIcon={faPhoneAlt}
                                                registered={getFilteredUser.user.registered.date}
                                                reveal={false}
                                            />
                                         </div>
                                    
                                        :
                                        <div className="all_users">
                                            <div className="users">
                                                    {userList}
                                            </div> 
                                        </div>
                    }
                    <div className="mainPage__bottom">
                        <div className="arrow">
                            <div 
                                style={showNextStyles}
                                className="arrowLeft" 
                                onClick={()=>{
                                    if (showSingle === false){
                                        setPaginate(paginate - 1); getUser(currentGender.length > 0 ? currentGender : "all")
                                    }
                                    }}
                            >
                                    {<FontAwesomeIcon icon={faAngleLeft}/>}
                            </div>
                            <div 
                            style={showNextStyles} 
                            className="arrowRight" 
                            onClick={()=>{
                                if (showSingle === false){
                                    setPaginate(paginate + 1); getUser(currentGender.length > 0 ? currentGender : "all")
                                }
                            }}
                            >
                                {<FontAwesomeIcon icon={faAngleRight}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        }
       </>
    )
}
export default Main

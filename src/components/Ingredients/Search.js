import React, {useEffect, useRef, useState} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const {refreshData} = props
    const [searchKeyword, setSearchKeyword] = useState('')
    const inputRef = useRef()
    useEffect(()=>{
        const timeoutId = setTimeout(()=>{
            refreshData(searchKeyword)
        },800);
        return ()=> {
            clearTimeout(timeoutId);
        }
    },[searchKeyword, refreshData])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" ref={inputRef} value={searchKeyword} onChange={(event)=> setSearchKeyword(event.target.value) } />
        </div>
      </Card>
    </section>
  );
});

export default Search;

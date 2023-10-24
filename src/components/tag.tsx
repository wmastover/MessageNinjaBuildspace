import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters,  } from "react-icons/ai"
import { MySvgIcon } from './svg';
import { useSelector , useDispatch} from 'react-redux';
import { changeLoading } from "../redux/loadingSlice"
import { changeSettings } from '../redux/pagesSlice';
import { SvgLoadedComponent } from './loadedSVG';

interface TagProps {
  onClickTag?: () => void; // Accepts a function with no output
}

export const Tag: React.FC<TagProps> = ({ onClickTag }) => {

  const isLoading = useSelector((state: any) => state.loading.value.loading); // assuming you have a combined reducer and `loading` is the key for this slice
  const dispatch = useDispatch();

  


  // no idea why this is here, should be redudant, **** test this ****
  useEffect(() => {
    dispatch(changeSettings(false))

  }, [isLoading])




  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }} onClick={onClickTag}>

      <div style={{ position: 'relative', left: isLoading ? '40px' : '0px', transition: 'left 0.5s ease-out' }}>
        {/* {isLoading ? <AiOutlineLoading3Quarters className="spinning" size={25}/> : <MySvgIcon size="80"/>} */}
        <MySvgIcon size="80"/>
      </div>

    </div>
  );
};


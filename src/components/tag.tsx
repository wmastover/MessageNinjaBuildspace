import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters, AiOutlineCheck } from "react-icons/ai"
import { MySvgIcon } from './svg';
import { useSelector , useDispatch} from 'react-redux';
import { changeLoading } from "../redux/loadingSlice"


interface TagProps {
  onClickTag?: () => void; // Accepts a function with no output
}

export const Tag: React.FC<TagProps> = ({ onClickTag }) => {

  const isLoading = useSelector((state: any) => state.loading.value.loading); // assuming you have a combined reducer and `loading` is the key for this slice
  const dispatch = useDispatch();

 

  useEffect(() => {


  }, [isLoading])



  return (
    <div className='Tag' style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} onClick={onClickTag}>
      {isLoading? <AiOutlineLoading3Quarters className="spinning" size={25}/> : <MySvgIcon size="30"/>}
    </div>
  );
};


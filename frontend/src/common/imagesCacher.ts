import { fetchImage } from "./fetchImage";

interface DynamicObject {
    [key: string]: string;
}

const userImages: DynamicObject = {};

const imageCacheChacker = async (id: string) => {
    if(userImages[id])
    {    
        return userImages[id];
    }else{
        const imageBase = await fetchImage(Number(id));
        userImages[id] = imageBase;
        return imageBase;
    }
}

export default imageCacheChacker;
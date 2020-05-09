import React, { useState, useEffect, Fragment } from 'react';

const ImageGrid = ({title, url, preview, showHQImages}) => {
    let previewImage = preview && preview.images && preview.images.length > 0 ?
                            preview.images[0] && preview.images[0].resolutions && preview.images[0].resolutions.length > 1 ?
                                    preview.images[0].resolutions.length > 3 ? 
                                        preview.images[0].resolutions[3] 
                                        :
                                        preview.images[0].resolutions[preview.images[0].resolutions.length - 1]
                                    :
                                    null
                            :
                            null;
    const [isImage, setIsImage] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    
    useEffect(() => {
        if(url.includes("v.redd")){
            console.log("Video");
            setIsVideo(true);
            setIsImage(false);
        }else if(url.endsWith(".gifv") || url.includes("gfycat")){
            setIsImage(false);
            setIsVideo(false);
        }else if(url.includes("i.redd") || url.includes("imgur")){
            setIsImage(true);
        }
    }, []);
    
    return (
        //Video disabled for now
        (isImage /*|| isVideo*/) && <Fragment>
            <h5>{title}</h5>
            {isImage && !showHQImages && preview.enabled ?  
                previewImage && <img src={previewImage.url} width={previewImage.width} height={previewImage.height} />
                :
                <img src={url} />
            }
            {isVideo && <video>
                            <source src={url} ></source>
                        </video>}
        </Fragment>
    );
};

export default ImageGrid;
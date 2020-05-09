import React, { useState } from 'react';
import Gallery from 'react-grid-gallery';

const ImageGallery = ({posts, showHQImages, rowHeight, showNsfw}) => {
    const getPreviewImage = (preview) => {
        return preview && preview.images && preview.images.length > 0 ?
                            preview.images[0] && preview.images[0].resolutions && preview.images[0].resolutions.length > 1 ?
                                    preview.images[0].resolutions.length > 3 ? 
                                        preview.images[0].resolutions[3] 
                                        :
                                        preview.images[0].resolutions[preview.images[0].resolutions.length - 1]
                                    :
                                    null
                            :
                            null;
    };
    
    let images = [];
    posts && posts.forEach(post => {
        const previewImage = getPreviewImage(post.preview);
        if(previewImage && !post.stickied && post.over_18 === showNsfw){
            images.push({
                src: post ? post.url : "",
                thumbnail: previewImage ? previewImage.url : "",
                thumbnailWidth: previewImage ? previewImage.width : "",
                thumbnailHeight: previewImage ? previewImage.height : "",
                caption: post ? post.title : ""
            });
        }
    });
    console.log(images);
    return <Gallery images={images} enableImageSelection={false} rowHeight={rowHeight} />
};

export default ImageGallery;
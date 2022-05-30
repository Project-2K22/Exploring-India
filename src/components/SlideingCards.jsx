import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import ImageCard from '../components/ImageCard';
import { auth, db } from '../firebase/config';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

//FOR SCROLLING START
import '../HScrollBar.css';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import useDrag from '../components/useDrag';
// FOR SCROLLING END
const SlideingCards = props => {
    const navigate = useNavigate();

    const { dragStart, dragStop, dragMove, dragging } = useDrag();
    const handleDrag =
        ({ scrollContainer }) =>
        ev =>
            dragMove(ev, posDiff => {
                if (scrollContainer.current) {
                    scrollContainer.current.scrollLeft += posDiff;
                }
            });

    const goToPageForSlide = (mid, uid, data) => {
        if (uid === undefined || uid === null) navigate('/login');
        var t = data;
        t.push(mid);
        update(ref(db, `users/${uid}`), {
            placeVisited: t,
        })
            .then(function () {
                navigate('/place-view/' + mid);
            })
            .catch(function (error) {
                const errorMessage = error.message;
            });
    };


    const openGoogleMap = (lat, long) => {
        window.open(
                                      `https://www.google.com/maps/?q=${lat},${long}`
        );
    };

    return (
        <Box>
            <Stack spacing={2} width="100%" direction="column">
                <Stack ml={17.5} mt={3} direction="column" spacing={2} width="auto">
                    <Stack direction="column" spacing={3} width="100%">
                        <Typography variant="h6" style={{ color: props.type === 'reshol' ? 'black' : 'white', fontWeight: '600' }}>
                            {props.value.topHeading}
                        </Typography>
                        <Box>
                            <div onMouseLeave={dragStop}>
                                <ScrollMenu
                                    onWheel={onWheel}
                                    onMouseDown={() => dragStart}
                                    onMouseUp={() => dragStop}
                                    onMouseMove={handleDrag}
                                >
                                    {props.type === undefined &&
                                        props.value.data.map((val,index) => {
                                            return (
                                                <ImageCard
                                                    key={index}
                                                    value={{
                                                        onClickFun: () => {
                                                            goToPageForSlide(val.id, props.value.uid, props.value.placeData);
                                                        },
                                                        placeName: val.name,
                                                        city: val.city,
                                                        buttonName: 'view',
                                                        imageLink: val.imagelinks[0],
                                                    }}
                                                />
                                            );
                                        })}
                                    {props.type === 'reshol' &&
                                        props.value.data.map((val,index) => {
                                            return (
                                                <ImageCard
                                                    type={props.type}
                                                    key={index}
                                                    value={{
                                                        onClickFun: () => {
                                                            openGoogleMap(val.latitude,val.longitude);
                                                        },
                                                        placeName: val.name,
                                                        city: val.ranking_geo,
                                                        buttonName: 'view',
                                                        imageLink: val.photo.images.original.url,
                                                    }}
                                                />
                                            );
                                        })}
                                </ScrollMenu>
                            </div>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};
function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}
export default SlideingCards;

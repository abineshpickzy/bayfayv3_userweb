import React, {useEffect, useState} from 'react';
import './BuzzCounter.scss';
import moment from "moment";
import {TrackOrderUtils} from "../../utils/TrackOrderUtils";

const BuzzCounter = ({lastTimeBuzzed, orderId}) => {
    let intervalId = null;

    const [hide, setHide] = useState(false);
    const [time, setTime] = useState({seconds: 0, minutes: 0});

    useEffect(() => {
        if (!lastTimeBuzzed) {
            setHide(true);
        } else {
            setHide(false);
            const enableAt = moment(lastTimeBuzzed, 'DD/MM/YYYY HH:mm:ss').add( 60 * 60, "seconds");
            const now = moment(new Date());
            const diff = now.diff(enableAt, "seconds") * -1;
            const min = Math.floor(diff / 60);
            const sec = diff % 60;
            setTime({seconds: sec, minutes: min});
            countDown();
        }
    }, [lastTimeBuzzed]);

    const countDown = () => {
        intervalId = setInterval(() => {
            setTime(prevState => {
                if (prevState.seconds > 0) {
                    return {seconds: prevState.seconds - 1, minutes: prevState.minutes};
                } else {
                    if (prevState.minutes > 0) {
                        return {
                            minutes: prevState.minutes - 1,
                            seconds: 59
                        };
                    } else {
                        TrackOrderUtils.removeOrderId(orderId);
                        setHide(true);
                        return {
                            minutes: 0,
                            seconds: 0
                        }
                    }
                }
            })
        }, 1000)
    };

    useEffect(() => {
        if (hide) {
            clearInterval(intervalId);
        }
    }, [hide]);

    return (
        <div className={`${hide ? 'd-none' : 'd-flex'} font-size-3 color-silver`}>
            <span>
                {time?.minutes.toString().length === 1 ? `0${time?.minutes}` : time?.minutes}
            </span>
            <span>:</span>
            <span>
                {time?.seconds.toString().length === 1 ? `0${time?.seconds}` : time?.seconds}
            </span>
        </div>
    );
};

export default BuzzCounter;

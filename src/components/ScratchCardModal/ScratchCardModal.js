import React from 'react';
import './ScratchCardModal.scss';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import imageSrc from '../../assets/images/scratch-image.png';
import { connect } from "react-redux";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import axios from "../../custom-axios";
import { TOKEN_EXPIRED } from "../../utils/constants";
import { LocationUtils } from "../../utils/LocationUtils";
import { API_ERROR, SCRATCH_CARD_FETCH_ERROR, SCRATCH_CARD_FETCH_SUCCESS } from "../../store/actionTypes/global-actions";
import { fetchImage } from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";
import TextAd from "../TextAd/TextAd";
import Aux from "../../utils/auxilary";

const CryptoJS = require("crypto-js");

const HEIGHT = 200;
const WIDTH = 200;
const SECRET = 'SDHYUBKI99J758JY436JBJSOJNGFVHV961';

class ScratchCardModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isDrawing: false,
            activated: false,
            drawingStarted: false,
            startX: 0,
            startY: 0,
            isLoading: false,
            images: {},
            canvasInitialized: false,
            showScratchData: false,
            adType2Image: null
        };
        this.canvasRef = React.createRef();
    }

    componentDidMount = () => {
        this.fetchAdsEncrypted(this.props.deliveryLocationCoordinates, this.props.productSearchLocationCoordinates);
    };

    initCanvas = () => {
        const canvas = this.canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");

            canvas.addEventListener("mousedown", this.scratchStart);
            canvas.addEventListener("mousemove", this.scratch);
            canvas.addEventListener("mouseup", this.scratchEnd);

            canvas.addEventListener("touchstart", this.scratchStart);
            canvas.addEventListener("touchmove", this.scratch);
            canvas.addEventListener("touchend", this.scratchEnd);

            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                context.drawImage(image, 0, 0);
                this.setState({
                    showScratchData: true
                })
            };

            context.fillRect(0, 50, WIDTH, HEIGHT);
            context.lineWidth = 60;
            context.lineJoin = "round";
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!(this.state.isLoading || !this.props.scratchCard) && !this.state.canvasInitialized) {
            this.setState({ ...this.state, canvasInitialized: true });
            this.initCanvas();
        }
    };

    fetchAdsEncrypted = (deliveryLocation, productSearchLocation) => {
        axios({
            url: '/ads/shopAds',
            method: 'POST',
            data: {
                "searchLocation": {
                    "type": "Point",
                    "coordinates": [productSearchLocation.lng, productSearchLocation.lat]
                },
                "deliveryLocation": {
                    "type": "Point",
                    "coordinates": [deliveryLocation.lng, deliveryLocation.lat]
                },
                "maxDistance": 5000
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const encrypted = response.data.data.cardInfo;
            const cardInfo = JSON.parse(this.decryptData(encrypted, SECRET));
            this.setState({ ...this.state, isLoading: false });
            if (response.data.success && response.data.data.adInfo?.length > 0) {
                response.data.data.adInfo.filter(a => a.ad_type === 2)
                    .forEach(ad => {
                        this.fetchAdImageType2(ad.banner_ad_info.image, ad.banner_ad_info.height, ad.banner_ad_info.width)
                    })
            }
            this.props.saveScratch({ data: { ...response.data.data, cardInfo } });
        }).catch(error => {
            this.setState({ ...this.state, isLoading: false });
            if (error?.response?.data?.token === TOKEN_EXPIRED) {
                LocationUtils.clearUserSavedAddressAndType();
            } else {
                this.props.scratchError(error);
            }
            this.props.apiError(error);
        });
    };

    decryptData = (data, key) => {
        let Key = key;
        let iv = key.slice(0, 16);

        let IV = CryptoJS.enc.Utf8.parse(iv);
        let decryptedText = CryptoJS.AES.decrypt(data, Key, {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decryptedText.toString(CryptoJS.enc.Utf8)
    };

    scratchStart = e => {
        if (!this.state.activated) {
            this.props.activateScard(this.props.scratchCard.cardInfo[0]._id);
        }
        const { layerX, layerY } = e;

        this.setState({
            isDrawing: true,
            drawingStarted: true,
            startX: layerX,
            startY: layerY,
            activated: true
        });
    };

    fetchAdImageType2 = (imageName, height, width) => {
        fetchImage(`/ads/view/img?img=${imageName}&format=jpeg&width=${width}&height=${height}`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                const base64Image = "data:;base64," + base64;
                this.setState(prevState => ({ ...prevState, images: { ...prevState.images, [imageName]: base64Image } }))
            })
             .catch(err => console.log(err));
    };

    scratch = e => {
        const { layerX, layerY } = e;
        const context = this.canvasRef.current.getContext("2d");

        if (!this.state.isDrawing) {
            return;
        }

        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.moveTo(this.state.startX, this.state.startY);
        context.lineTo(layerX, layerY);
        context.closePath();
        context.stroke();

        this.setState({
            startX: layerX,
            startY: layerY
        });
    };

    scratchEnd = e => {
        this.setState({
            isDrawing: false
        });
    };

    render() {
        return (
            <ModalWrapper show={this.props.show} clickBackdrop={this.props.clickBackdrop} showFirst={true}
                fullHeight={true}>
                <div className="modal-dialog scratch-card-modal" role="document">
                    <div className="modal-content scratch-card-modal-content position-relative h-100 w-100">
                        {!(this.state.isLoading || !this.props.scratchCard) ? <div className='scratch-card-modal-body'>
                            <i className='fal fa-times close-scratch-card-modal' onClick={this.props.clickBackdrop} />
                            {this.props.scratchCard?.cardInfo?.length > 0 ?
                                <Aux><span className='reward-title'>{this.props.scratchCard.titlemsg}</span>
                                    <div className='scratch-card-content'>
                                        <canvas
                                            ref={this.canvasRef}
                                            id="canvas"
                                            className='canvas-scratch'
                                            width={`${WIDTH}px`}
                                            height={`${HEIGHT}px`}
                                        />
                                        {this.state.showScratchData ? <div className='scratch-code'>
                                            {this.props.scratchCard.cardInfo[0].card_type === 1 ?
                                                this.props.scratchCard.cardInfo[0].reward_info.random_cost === 0 ?
                                                    <div className='d-flex flex-column align-items-center'>
                                                        <img
                                                            src={require('../../assets/images/scratch_rewardBlue@3x.png')}
                                                            alt=""
                                                            className='scratch-reward-img' />
                                                        <span className='reward-text'>Better Luck Next Time</span>
                                                    </div> :
                                                    <div className='d-flex flex-column align-items-center'>
                                                        <img
                                                            src={require('../../assets/images/scratch_rewardGold@3x.png')}
                                                            alt=""
                                                            className='scratch-reward-img' />
                                                        <span
                                                            className='reward-text'>You've Won ₹ {this.props.scratchCard.cardInfo[0].reward_info.random_cost}</span>
                                                    </div>
                                                :
                                                <div className='d-flex flex-column align-items-center font-weight-bold'>
                                                    <div className='promo-value'>
                                                        <span className='promo-value-label'>
                                                            {this.props.scratchCard.cardInfo[0].promo_info.code_type === 2 ? '₹ ' : null}
                                                            {this.props.scratchCard.cardInfo[0].promo_info.code_value}
                                                            {this.props.scratchCard.cardInfo[0].promo_info.code_type === 1 ? '% ' : null}
                                                        </span>
                                                        <span className='promo-type-label'>
                                                            {this.props.scratchCard.cardInfo[0].promo_info.code_model === 1 ? 'Cashback' : 'Discount'}
                                                        </span>
                                                    </div>
                                                    <span className='mt-2'>
                                                        <span className='promo-code-label'>Code:</span>
                                                        <span
                                                            className='promo-code-value'>{this.props.scratchCard.cardInfo[0].promo_info.promo_code}</span>
                                                    </span>
                                                    {this.props.scratchCard.cardInfo[0].promo_info?.note?.length > 0 ?
                                                        <span className='promo-note'>
                                                            {this.props.scratchCard.cardInfo[0].promo_info.note}
                                                        </span> : null}
                                                </div>}
                                        </div> : null}
                                    </div>
                                </Aux> : null}
                            {!this.state.drawingStarted && this.props.scratchCard?.cardInfo?.length > 0 ?
                                <span className='swipe-label'>Swipe the above card to see your reward</span> : null}
                            {this.props.scratchCard.adInfo?.length > 0 ? <div
                                className={`d-inline-block ${(!this.state.showScratchData || this.state.showScratchData.cardInfo?.length === 0) ? 'mt-4' : ''}`}>
                                <div
                                    className={`ads-images ${this.props.scratchCard?.cardInfo?.length > 0 ? '' : 'h-100 justify-content-center'}`}>
                                    {this.props.scratchCard.adInfo.map(ad => (
                                        ad.ad_type === 2 ? this.state.images[ad.banner_ad_info.image] ?
                                            <img src={this.state.images[ad.banner_ad_info.image]} alt="ad"
                                                className='ad-image' key={ad.ad_id}
                                                onClick={() => this.props.navigateToProducts(ad.unique_id, ad.ad_id)} /> :
                                            <ImageLoader cssClass='adWh' customSize={true} key={ad.ad_id} /> :
                                            <TextAd ad={ad} key={ad.ad_id} onClick={() => this.props.navigateToProducts(ad.unique_id, ad.ad_id)} />
                                    ))}
                                </div>
                            </div> : null}
                            {!(this.props.scratchCard?.cardInfo?.length > 0) && !(this.props.scratchCard?.adInfo?.length > 0) ?
                                <div
                                    className='d-flex w-100 h-100 align-items-center justify-content-center font-size-25 text-white font-weight-bold'>
                                    Currently Rewards Unavailable
                                </div> : null}
                        </div> : this.state.isLoading ? <RequestSpinner /> : <div>No rewards found!</div>}
                    </div>
                </div>

            </ModalWrapper>
        );
    }
};

const mapStateToProps = ({ globalReducer }) => {
    return {
        deliveryLocationCoordinates: globalReducer.deliveryLocationCoordinates,
        productSearchLocationCoordinates: globalReducer.productSearchLocationCoordinates,
        scratchCard: globalReducer.scratchCard
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveScratch: (data) => dispatch({ type: SCRATCH_CARD_FETCH_SUCCESS, payload: data }),
        scratchError: (error) => dispatch({ type: SCRATCH_CARD_FETCH_ERROR, payload: error }),
        apiError: (error) => dispatch({ type: API_ERROR, payload: error })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScratchCardModal);

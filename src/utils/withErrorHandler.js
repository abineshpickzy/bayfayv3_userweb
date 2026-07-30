import React, {Component} from 'react';
import ErrorModal from '../components/ErrorModal/ErrorModal';
import Aux from "./aux";
import ModalWrapper from "../components/ModalWrapper/ModalWrapper";


const errorMessage = "Network error!";

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        };

        componentDidMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                //this.setState({error: null});
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error.response ? error.response.data.message : errorMessage});
            });
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        };

        render() {
            let modal = null;
            if (this.state.error) {

                modal =
                    <ModalWrapper show={this.state.error !== null} clickBackdrop={this.errorConfirmedHandler}>
                        <ErrorModal
                            modalClosed={this.errorConfirmedHandler}
                            message={this.state.error}/>
                    </ModalWrapper>;
            }
            return (
                <Aux>
                    {modal}
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
};

export default withErrorHandler;

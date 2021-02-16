import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { connect } from "react-redux";
import { connect as dashboardConnect } from "../../store/dashboard/actions";
import { getConfig } from "../../config";
import { SessionState } from "../../store/dashboard/contants";

class Login extends Component {
  constructor(props) {
    super(props);
    const config = getConfig();
    this.state = {
      username: props.username || config.mqtt.username,
      password: config.mqtt.password,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  handleSubmit(event) {
    const config = getConfig();
    const configToApply = { ...config };
    configToApply.mqtt = {
      ...config.mqtt,
      username: this.state.username,
      password: this.state.password,
    };
    this.props.dispatch(dashboardConnect(configToApply));
    event.preventDefault();
  }

  render() {
    const config = getConfig();
    const loginConfig = config.loginPage;
    const host = config.mqtt.host + ":" + config.mqtt.port;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    if (this.props.sessionState === SessionState.CONNECTED) {
      return <Redirect to={from} />;
    }
    const isConnecting = this.props.sessionState === SessionState.CONNECTING;

    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="4">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      {loginConfig.isHostShown && (
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="host-login-icon" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput type="text" name="host" disabled={true} value={host} />
                        </CInputGroup>
                      )}
                      {loginConfig.isUserShown && (
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="user-login-icon" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="text"
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                            disabled={isConnecting}
                            value={this.state.username}
                            onChange={this.handleInputChange}
                          />
                        </CInputGroup>
                      )}
                      {loginConfig.isPasswordShown && (
                        <CInputGroup className="mb-4">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="password-login-icon" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            disabled={isConnecting}
                            value={this.state.password}
                            onChange={this.handleInputChange}
                          />
                        </CInputGroup>
                      )}
                      {this.props.errorMessage && (
                        <CRow>
                          <CAlert color="danger">Error: {this.props.errorMessage}</CAlert>
                        </CRow>
                      )}
                      <CRow>
                        <CCol xs="6">
                          <CButton
                            color="primary"
                            className="px-4"
                            disabled={isConnecting}
                            onClick={this.handleSubmit}
                          >
                            {isConnecting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>{" "}
                                Connecting
                              </>
                            ) : (
                              "Login"
                            )}
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}

const mapStateToLoginProps = state => ({
  host: state.dashboard.session.host,
  username: state.dashboard.session.username,
  errorMessage: state.dashboard.session.reason,
  sessionState: state.dashboard.session.state,
});

export default connect(mapStateToLoginProps)(withRouter(Login));

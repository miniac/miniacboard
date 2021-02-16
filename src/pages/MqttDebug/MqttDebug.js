import React from "react";
import { CRow, CCol, CCard, CCardHeader, CCardBody, CDataTable } from "@coreui/react";
import { useSelector } from "react-redux";
import Dashboard from "../../dashboard/Dashboard";

const Subscriptions = props => {
  const subscriptions = useSelector(state => state.mqtt.subscriptions);
  const tableData = Object.entries(subscriptions).map(([id, subscription]) => ({
    id: id,
    filter: subscription.filter.raw,
  }));

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Subscriptions</CCardHeader>
            <CCardBody>
              <CDataTable items={tableData} fields={["id", "filter"]} striped />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

const ArrivedMessages = props => {
  const arrivedMessages = useSelector(state => state.mqtt.history.arrivedMessages);
  const tableData = arrivedMessages.map((message, idx) => ({
    id: idx,
    timestamp: message.timestamp,
    topic: message.topic,
    payload: message.payload,
  }));

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Arrived messages</CCardHeader>
            <CCardBody>
              <CDataTable items={tableData} fields={["timestamp", "topic", "payload"]} striped />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

const PublishedMessages = props => {
  const publishedMessages = useSelector(state => state.mqtt.history.publishedMessages);
  const tableData = publishedMessages.map((message, idx) => ({
    id: idx,
    timestamp: message.timestamp,
    topic: message.topic,
    payload: message.payload,
    qos: message.qos,
    retained: message.retained,
  }));

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Published messages</CCardHeader>
            <CCardBody>
              <CDataTable
                items={tableData}
                fields={["timestamp", "topic", "payload", "qos", "retained"]}
                striped
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

const MqttDebug = props => {
  return (
    <Dashboard title="Debug MQTT">
      <Subscriptions />
      <ArrivedMessages />
      <PublishedMessages />
    </Dashboard>
  );
};

export default MqttDebug;

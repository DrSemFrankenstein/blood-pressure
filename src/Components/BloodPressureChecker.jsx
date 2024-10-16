import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  Card,
  Typography,
  Slider,
  Row,
  Col,
  Statistic,
  Divider,
  Result,
  Modal,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateBloodPressureData } from "../Redux/bloodPressureSlice"; // Import the Redux action

const { Title } = Typography;

const BloodPressureChecker = () => {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.bloodPressure); // Get saved data from Redux

  const [age, setAge] = useState(savedData.age || null);
  const [weight, setWeight] = useState(savedData.weight || null);
  const [height, setHeight] = useState(savedData.height || null);
  const [systolic, setSystolic] = useState(savedData.systolic || null);
  const [diastolic, setDiastolic] = useState(savedData.diastolic || null);
  const [heartRate, setHeartRate] = useState(savedData.heartRate || null);
  const [bmi, setBmi] = useState(savedData.bmi || null);
  const [result, setResult] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [generalConclusion, setGeneralConclusion] = useState(
    savedData.generalConclusion || "Normal"
  ); // General conclusion state
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (savedData) {
      // Load saved data when the component mounts
      setAge(savedData.age);
      setWeight(savedData.weight);
      setHeight(savedData.height);
      setSystolic(savedData.systolic);
      setDiastolic(savedData.diastolic);
      setHeartRate(savedData.heartRate);
      setBmi(savedData.bmi);
      setGeneralConclusion(savedData.generalConclusion);
    }
  }, [savedData]);

  const calculateBMI = (weight, height) => {
    return (weight / ((height / 100) * (height / 100))).toFixed(1);
  };

  const checkBloodPressure = () => {
    const calculatedBMI = calculateBMI(weight, height);
    setBmi(calculatedBMI);

    // Normal ranges for a 36-year-old man with a height of 180cm and weight of 70kg
    let normalSystolic = 120;
    let normalDiastolic = 80;
    let normalHeartRate = 70;
    const bmiNormalRange = [18.5, 24.9]; // Normal BMI range

    // Calculate differences and conclusions
    const systolicDifference = systolic - normalSystolic;
    const diastolicDifference = diastolic - normalDiastolic;

    let systolicConclusion = "";
    let diastolicConclusion = "";
    let heartRateConclusion = "";
    let bmiConclusion = "";

    // Systolic conclusion
    if (systolic < normalSystolic - 10) {
      systolicConclusion = "Low";
    } else if (systolic > normalSystolic + 10) {
      systolicConclusion = "High";
    } else {
      systolicConclusion = "Normal";
    }

    // Diastolic conclusion
    if (diastolic < normalDiastolic - 10) {
      diastolicConclusion = "Low";
    } else if (diastolic > normalDiastolic + 10) {
      diastolicConclusion = "High";
    } else {
      diastolicConclusion = "Normal";
    }

    // Heart Rate conclusion
    if (heartRate < normalHeartRate - 10) {
      heartRateConclusion = "Low";
    } else if (heartRate > normalHeartRate + 10) {
      heartRateConclusion = "High";
    } else {
      heartRateConclusion = "Normal";
    }

    // BMI conclusion
    if (calculatedBMI < bmiNormalRange[0]) {
      bmiConclusion = "Underweight";
    } else if (calculatedBMI > bmiNormalRange[1]) {
      bmiConclusion = "Overweight";
    } else {
      bmiConclusion = "Normal";
    }

    // Set overall conclusion
    const overallConclusion = (() => {
      if (
        systolicConclusion === "High" ||
        diastolicConclusion === "High" ||
        heartRateConclusion === "High"
      ) {
        return "High";
      } else if (
        systolicConclusion === "Low" ||
        diastolicConclusion === "Low" ||
        heartRateConclusion === "Low"
      ) {
        return "Low";
      } else {
        return "Normal";
      }
    })();

    setGeneralConclusion(overallConclusion);
    setConclusion(
      `Systolic Pressure: ${systolicConclusion}, Diastolic Pressure: ${diastolicConclusion}, Heart Rate: ${heartRateConclusion}, BMI: ${bmiConclusion}`
    );

    setResult(
      `Normal Systolic: ${normalSystolic}, Normal Diastolic: ${normalDiastolic}, Normal Heart Rate: ${normalHeartRate}.`
    );

    // Dispatch to Redux
    dispatch(
      updateBloodPressureData({
        age,
        weight,
        height,
        systolic,
        diastolic,
        heartRate,
        bmi: calculatedBMI,
        generalConclusion: overallConclusion,
      })
    );

    // Show modal with result
    setIsModalVisible(true);
  };

  const getColor = (value, normal, diff) => {
    if (value < normal - diff) {
      return "#cf1322"; // red for low
    } else if (value > normal + diff) {
      return "#cf1322"; // red for high
    } else {
      return "#3f8600"; // green for normal
    }
  };

  const getIcon = (value, normal, diff) => {
    if (value < normal - diff) {
      return <ArrowDownOutlined />;
    } else if (value > normal + diff) {
      return <ArrowUpOutlined />;
    } else {
      return null;
    }
  };

  return (
    <Card
      title="Blood Pressure Checker"
      style={{ maxWidth: 600, margin: "auto" }}
    >
      <p>Learn more about hypertension by visiting the WHO guidelines.</p>
      <a
        href="https://cdn.who.int/media/docs/default-source/searo/ncd/ncd-flip-charts/3.-hypertension-24-04-19.pdf?sfvrsn=b6c791ad_4"
        target="_blank"
        rel="noopener noreferrer"
      >
        Click here for the full guidelines
      </a>
      <Divider />
      <Form layout="vertical" onFinish={checkBloodPressure}>
        <Form.Item label="Age">
          <InputNumber
            min={1}
            onChange={setAge}
            value={age}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Weight (kg)">
          <InputNumber
            min={1}
            onChange={setWeight}
            value={weight}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Height (cm)">
          <InputNumber
            min={1}
            onChange={setHeight}
            value={height}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Divider />
        <Form.Item label="Systolic Pressure (mmHg)">
          <InputNumber
            min={1}
            onChange={setSystolic}
            value={systolic}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Diastolic Pressure (mmHg)">
          <InputNumber
            min={1}
            onChange={setDiastolic}
            value={diastolic}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Heart Rate (bpm)">
          <InputNumber
            min={1}
            onChange={setHeartRate}
            value={heartRate}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Check
          </Button>
        </Form.Item>
      </Form>

      {result && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>Result</Title>
          <p
            style={{
              color: generalConclusion === "Normal" ? "#3f8600" : "#cf1322",
            }}
          >
            General Conclusion: {generalConclusion}
          </p>
          <p>Conclusion: {conclusion}</p>
          <Divider />
          <p>{result}</p>

          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Current BMI"
                value={bmi}
                precision={1}
                valueStyle={{
                  color:
                    bmi < 18.5
                      ? "#cf1322"
                      : bmi <= 24.9
                      ? "#3f8600"
                      : "#cf1322",
                }}
                prefix={bmi < 18.5 || bmi > 24.9 ? <ArrowUpOutlined /> : null}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Heart Rate"
                value={heartRate}
                suffix="bpm"
                valueStyle={{
                  color: getColor(heartRate, 70, 10),
                }}
                prefix={getIcon(heartRate, 70, 10)}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Statistic
                title="Systolic"
                value={Math.abs(systolic - 120)}
                suffix="mmHg"
                valueStyle={{
                  color: getColor(systolic, 120, 10),
                }}
                prefix={getIcon(systolic, 120, 10)}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Diastolic"
                value={Math.abs(diastolic - 80)}
                suffix="mmHg"
                valueStyle={{
                  color: getColor(diastolic, 80, 10),
                }}
                prefix={getIcon(diastolic, 80, 10)}
              />
            </Col>
          </Row>
        </Card>
      )}

      <Modal
        title="Blood Pressure Check Result"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setIsModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <Result
          status={
            generalConclusion === "Normal"
              ? "success"
              : generalConclusion === "High"
              ? "error"
              : "warning"
          }
          title={`Your Blood Pressure is ${generalConclusion}`}
          subTitle={conclusion}
        />
      </Modal>
    </Card>
  );
};

export default BloodPressureChecker;

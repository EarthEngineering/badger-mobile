// @flow
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  SafeAreaView,
  TextInput,
  View,
  Clipboard,
  Dimensions,
  Image
} from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";
import Ionicons from "react-native-vector-icons/Ionicons";
import makeBlockie from "ethereum-blockies-base64";

import { T, H1, H2, Button, Spacer } from "../atoms";
import BitcoinCashImage from "../assets/images/icon.png";

import { type TokenData } from "../data/tokens/reducer";
import { tokensByIdSelector } from "../data/tokens/selectors";

const StyledTextInput = styled(TextInput)`
  border: 1px ${props => props.theme.primary500};
  padding: 15px 5px;
`;

const ScreenWrapper = styled(SafeAreaView)`
  position: relative;
  margin: 0 6px;
`;

const StyledButton = styled(Button)`
  align-items: center;
  flex: 1;
  margin-left: 5px;
  margin-right: 5px;
`;

const ButtonArea = styled(View)`
  flex-direction: row;
  justify-content: space-around;
`;

const QROverlayScreen = styled(View)`
  position: relative;
  height: ${Dimensions.get("window").height}px;
`;

const IconArea = styled(View)`
  align-items: center;
  justify-content: center;
`;
const IconImage = styled(Image)`
  width: 48;
  height: 48;
  border-radius: 24;
  overflow: hidden;
`;

type Props = {
  tokensById: { [tokenId: string]: TokenData },
  navigation: {
    navigate: Function,
    state?: { params: { symbol: string, tokenId: ?string } }
  }
};

// Only allow numbers and a single . in amount input
const formatAmount = (amount: string): string => {
  const validCharacters = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let decimalCount = 0;

  const valid = amount.split("").reduce((prev, curr) => {
    if (validCharacters.includes(curr)) return [...prev, curr];
    if (curr === "." && decimalCount === 0) {
      decimalCount++;
      return [...prev, curr];
    }
    return prev;
  }, []);
  return valid.join("");
};

const SendSetupScreen = ({ navigation, tokensById }: Props) => {
  const [toAddress, setToAddress] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState("0");

  // Todo - Handle if send with nothing pre-selected on navigation
  const { symbol, tokenId } = (navigation.state && navigation.state.params) || {
    symbol: null,
    tokenId: null
  };

  const coinName =
    symbol === "BCH" && !tokenId ? "Bitcoin Cash" : tokensById[tokenId].name;

  const imageSource =
    symbol === "BCH" ? BitcoinCashImage : { uri: makeBlockie(tokenId) };

  return (
    <ScreenWrapper>
      {qrOpen && (
        <QROverlayScreen>
          <QRCodeScanner
            cameraProps={{ ratio: "1:1", captureAudio: false }}
            fadeIn={false}
            onRead={e => {
              const address = e.data;
              setToAddress(address);
              setQrOpen(false);
            }}
            cameraStyle={{
              height: Dimensions.get("window").width - 12,
              width: Dimensions.get("window").width - 12
            }}
            topViewStyle={{ height: "auto", flex: 0 }}
            topContent={
              <View>
                <Spacer />
                <H2>Scan QR Code</H2>
                <Spacer />
              </View>
            }
            bottomContent={
              <Button onPress={() => setQrOpen(false)} text="Cancel Scan" />
            }
          />
        </QROverlayScreen>
      )}
      <Spacer />
      <H1 center>Create Transaction</H1>
      <Spacer />
      <IconArea>
        <IconImage source={imageSource} />
      </IconArea>
      <Spacer small />
      <H2 center>
        {coinName} ({symbol})
      </H2>
      {tokenId && (
        <T size="tiny" center>
          {tokenId}
        </T>
      )}
      <Spacer />
      <T>Send To:</T>
      <Spacer small />
      <StyledTextInput
        editable
        multiline
        autoComplete="off"
        autoCorrect={false}
        autoFocus
        value={toAddress}
        onChangeText={text => {
          setToAddress(text);
        }}
      />
      <Spacer small />
      <ButtonArea>
        <StyledButton
          onPress={async () => {
            const content = await Clipboard.getString();
            setToAddress(content);
          }}
        >
          <Ionicons name="ios-clipboard" size={22} />
          <T>Paste</T>
        </StyledButton>
        <StyledButton text="Scan QR" onPress={() => setQrOpen(true)}>
          <Ionicons name="ios-qr-scanner" size={22} />
          <T>Scan QR</T>
        </StyledButton>
      </ButtonArea>
      <Spacer />

      <T>Amount:</T>
      <Spacer small />
      <StyledTextInput
        keyboardType="numeric"
        editable
        autoComplete="off"
        autoCorrect={false}
        value={sendAmount}
        onChangeText={text => {
          setSendAmount(formatAmount(text));
        }}
      />
      <Spacer small />

      <Button
        onPress={() => navigation.navigate("SendConfirm")}
        text="Next Step"
      />
    </ScreenWrapper>
  );
};

const mapStateToProps = state => {
  const tokensById = tokensByIdSelector(state);
  return {
    tokensById
  };
};

export default connect(mapStateToProps)(SendSetupScreen);

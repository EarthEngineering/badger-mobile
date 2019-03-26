// @flow

import React, { useEffect } from "react";
import styled from "styled-components";
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import { hasMnemonicSelector } from "../data/accounts/selectors";
import { getAccount } from "../data/accounts/actions";

// Later - Add a way to add a password here for encryption instead of passing through.

const ScreenWrapper = styled(SafeAreaView)`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

type Props = {
  navigation: { navigate: Function },
  isCreated: boolean,
  getAccount: Function
};
const CreateWalletScreen = ({ navigation, isCreated, getAccount }: Props) => {
  useEffect(() => {
    if (isCreated) {
      navigation.navigate("Home");
    } else {
      getAccount();
    }
  }, [isCreated]);

  return (
    <ScreenWrapper>
      <ActivityIndicator />
    </ScreenWrapper>
  );
};

const mapStateToProps = state => ({ isCreated: hasMnemonicSelector(state) });
const mapDispatchToProps = {
  getAccount
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletScreen);
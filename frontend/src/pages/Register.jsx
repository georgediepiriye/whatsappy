import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  padding-bottom: 10px;

  flex-direction: column;
  align-items: center;
  width: 30vw;
  height: auto;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: white;
`;

const Heading = styled.h2`
  margin: 10px 0px;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 12%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`;
const LabelContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
`;
const Label = styled.h5`
  color: #302f2f;
  padding-left: 50px;
`;
const Input = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 10px;
  width: 80%;
  height: 3rem;
  padding: 1rem;
  border: none;
  outline: none;
  color: #3c354e;
  font-size: 1rem;
  font-weight: bold;
  &:focus {
    display: inline-block;
    box-shadow: 0 0 0 0.2rem #0000ff;
    backdrop-filter: blur(12rem);
  }
  &::placeholder {
    color: grey;
    font-weight: 100;
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

const Button = styled.button`
  width: 80%;
  padding: 15px 20px;
  border: none;

  background-color: #01016ed5;
  cursor: pointer;
  justify-self: center;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: white;

  &:hover {
    background-color: #0000ff;
    color: white;
  }
`;

const LastTextContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
  padding-right: 50px;
`;

const LastText = styled.h5`
  cursor: pointer;
`;

//register
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUserame] = useState("");
  const [fileInputState, setFileInputState] = useState("");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFileInputState(e.target.value);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  //toast when passords dont match
  const passwordMatch = () => {
    toast.error("Both Passwords don't match!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
    });
  };

  //toast when registration is successfull
  const notifySuccess = () => {
    toast.success("Registration Successfull!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
    });
  };

  const Register = async (e) => {
    e.preventDefault();

    setIsRegistering(true);
    if (!username || !name || !password) {
      toast.error("Please enter all fields!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
      });
      setIsRegistering(false);
      return;
    }
    if (password !== confirmPassword) {
      passwordMatch();
      setIsRegistering(false);
      return;
    }

    const newUser = { name, username, image, password };

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const res = await axios.post(
        "http://localhost:5003/api/v1/users/register",
        newUser,
        config
      );
      if (res) {
        notifySuccess();
        localStorage.setItem("userInfo", JSON.stringify(res));
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Wrapper onSubmit={Register}>
        <Heading>Sign Up</Heading>
        <InputContainer>
          <LabelContainer>
            <Label>Name</Label>
          </LabelContainer>
          <Input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <LabelContainer>
            <Label>Username</Label>
          </LabelContainer>
          <Input
            type="text"
            required
            id="username"
            value={username}
            onChange={(e) => {
              setUserame(e.target.value);
            }}
          />
        </InputContainer>

        <InputContainer>
          <LabelContainer>
            <Label>Upload your Picture</Label>
          </LabelContainer>
          <Input
            type="file"
            id="image"
            accept="image/*"
            name="image"
            value={fileInputState}
            onChange={handleFileInputChange}
          />
        </InputContainer>
        <InputContainer>
          <LabelContainer>
            <Label>Password</Label>
          </LabelContainer>
          <Input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <LabelContainer>
            <Label>Confirm Password</Label>
          </LabelContainer>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </InputContainer>
        <ButtonContainer>
          {isRegistering ? (
            <Button disabled>
              <CircularProgress color="inherit" />
            </Button>
          ) : (
            <Button type="submit">Sign Up</Button>
          )}
        </ButtonContainer>
        <LastTextContainer>
          <Link to={"/login"} style={{ color: "white" }}>
            <LastText>Login</LastText>
          </Link>
        </LastTextContainer>
      </Wrapper>
    </Container>
  );
};

export default Register;

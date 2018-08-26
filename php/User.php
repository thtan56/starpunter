<?php

class User {
    private $dbserver = "127.0.0.1";
    private $dbuser = "root";
    private $dbpass = "cancer56";
    private $dbdatabase = "test";
    private $msg = "";

    public function getMsg() { return $this->msg; }
    public function getUsers()
    {
        $user = array();
        try {
            $mysqli = new mysqli($this->dbserver, $this->dbuser, $this->dbpass, $this->dbdatabase);
            if ($mysqli->connect_errno) {
                $this->msg = $mysqli->error;
                return $user;
            }
            $query = "select id, username, password, email, role, address1, address2, town, firstname, lastname,";
            $query .= "town, postcode, country, bankbsb, bankaccount from user";
            if (!($stmt = $mysqli->prepare($query))) {
                $mysqli->close();
                $this->msg = $mysqli->error;
                return $user;
            }
            if (!$stmt->execute()) {
                $mysqli->close();
                $this->msg = $stmt->error;
                return $user;
            } else {
                $stmt->bind_result($id,$username,$password,$email,$role,$address1,$address2,$town,$firstname,$lastname,
                    $town, $postcode, $country, $bankbsb, $bankaccount);
                while ($stmt->fetch()) {
                    array_push($user, array("id"=>$id,"username"=>$username,"password"=>$password,"email"=>$email,
                        "role"=>$role,"address1"=>$address1, "address2"=>$address2,"town"=>$town,"firstname"=>$firstname,
                        "lastname"=>$lastname,"town"=>$town,"postcode"=>$postcode,"country"=>$country,"bankbsb"=>$bankbsb,"bankaccount"=>$bankaccount));
                }
            }

            $stmt->close();
            $mysqli->close();

        } catch (Exception $e) {

            $this->msg = $e->getMessage();
        }

        return $user;
    }
    public function insertUser($username,$password,$email,$firstname, $lastname, $role, $address1, $address2,
            $town, $postcode, $country, $bankbsb, $bankaccount) {
        $user = -1;
        try {
            $mysqli = new mysqli($this->dbserver, $this->dbuser, $this->dbpass, $this->dbdatabase);
            if ($mysqli->connect_errno) { $this->msg = $mysqli->error; return $user; }
            $query = "insert into user(username,password,email,
            firstname, lastname, role, address1, address2,
            town, postcode, country, bankbsb, bankaccount,
            created) values(?,?,?,?,?,?,?,?,?,?,?,?,?,now())";
            if (!($stmt = $mysqli->prepare($query))) {
                $mysqli->close();
                $this->msg = $mysqli->error;
                return $user;
            }
            $stmt->bind_param('sssssssssssss', $username,$password, $email,
            $firstname, $lastname, $role, $address1, $address2,
            $town, $postcode, $country, $bankbsb, $bankaccount);

            if (!$stmt->execute()) {
                $mysqli->close();
                $this->msg = $stmt->error;
                return $user;
            }
            $user = 1;
            $this->msg = "";
            $stmt->close();
            $mysqli->close();
        } catch (Exception $e) { $this->msg = $e->getMessage(); }
        return $user;
    }
    public function updateUser($id,$username,$password,$email,
            $firstname, $lastname, $role, $address1, $address2,
            $town, $postcode, $country, $bankbsb, $bankaccount) {
        $user = -1;
        try {
            $mysqli = new mysqli($this->dbserver, $this->dbuser, $this->dbpass, $this->dbdatabase);
            if ($mysqli->connect_errno) { $this->msg = $mysqli->error; return $user; }
            $query = "update user set username=?,password=?, email=?, firstname=?,lastname=?,role=?, ";
            $query .= " address1=?, address2=?, town=?, postcode=?, country=?, bankbsb=?, bankaccount=? where id=?";
            if (!($stmt = $mysqli->prepare($query))) {
                $mysqli->close();
                $this->msg = $mysqli->error;
                return $user;
            }
            $stmt->bind_param('sssssssssssssd', $username,$password,$email,$firstname, $lastname, $role, $address1, $address2,$town, $postcode, $country, $bankbsb, $bankaccount, $id);
            if (!$stmt->execute()) {
                $mysqli->close();
                $this->msg = $stmt->error;
                return $user;
            }
            $user = 1;
            $this->msg = "";
            $stmt->close();
            $mysqli->close();
        } catch (Exception $e) { $this->msg = $e->getMessage(); }
        return $user;
    }
    public function deleteUser($id)
    {
        $user = -1;
        try {
            $mysqli = new mysqli($this->dbserver, $this->dbuser, $this->dbpass, $this->dbdatabase);
            if ($mysqli->connect_errno) {
                $this->msg = $mysqli->error;
                return $user;
            }
            $query = "delete from user where id=?";
            if (!($stmt = $mysqli->prepare($query))) {
                $mysqli->close();
                $this->msg = $mysqli->error;
                return $user;
            }
            $stmt->bind_param('d', $id);
            if (!$stmt->execute()) {
                $mysqli->close();
                $this->msg = $stmt->error;
                return $user;
            }
            $user = 1;
            $this->msg = "";
            $stmt->close();
            $mysqli->close();

        } catch (Exception $e) { $this->msg = $e->getMessage(); }

        return $user;
    }
}
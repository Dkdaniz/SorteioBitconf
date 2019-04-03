pragma solidity >=0.4.21 <=0.5.0;

contract SorteioVIIBitconf {
    address internal owner;
    uint256 internal numberUser = 1;

    event NewPerson(string _name, string _email, uint256 _id);

    struct Person { 
        string name;
        string email;
        uint256 id;
    }

    mapping(uint256 => Person) people;
    mapping(uint256 => uint256) ids;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function _register(string _name, string _email, uint256 _id) external onlyOwner() returns (bool){
    require(_id != 0,"id not found.");

        numberUser += 1;
        people[numberUser].name = _name;
        people[numberUser].email = _email;
        people[numberUser].id = _id;
        ids[_id] = numberUser;

        emit NewPerson(_name,_email,_id);
    }

    function _searchId(uint256 _id) public view onlyOwner() returns (bool){
        if(ids[_id] != 0)
            return true;
        else
            return false;
        
    }

    function _searchPerson(uint256 _index) public view onlyOwner() returns (string _name,string _email,uint256 _id){
        if(ids[_id] == 0)
            _name = "";
            _email = "";
            _id = 0;  
        else
            uint256 numberUser = ids[_id];
            _name = people[numberUser].name;
            _email = people[numberUser].email;
            _id = [people[numberUser].id;
    }
}

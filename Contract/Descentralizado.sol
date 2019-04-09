pragma solidity >=0.4.21 <=0.5.0;

contract SorteioVIIBitconf {
    
    address public owner;
    uint256 internal numberUser = 0;
    string public ganhador; 

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
    
    modifier onlyUser(uint256 _id) {
        require(ids[_id] == 0);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function _searchPerson(uint256 _indexPerson) external view onlyOwner() returns (string _name,string _email,uint256 _id){
        require(ids[_indexPerson] != 0);
        uint256 userNumber = ids[_indexPerson];
        _name = people[userNumber].name;
        _email = people[userNumber].email;
        _id = people[userNumber].id;
        
    }
    
    function _winners() external onlyOwner() returns(uint256 _index, string _name, string _email, uint256 _id){
        _index =  uint256(keccak256(block.timestamp, block.difficulty))%numberUser;
        _name = people[_index].name;
        _email = people[_index].email;
        _id = people[_index].id;
        ganhador = _name;
        
    }

    function _recorder(string _name, string _email, uint256 _id) external onlyOwner() onlyUser(_id) {
        require(_id != 0,"id not found.");
        numberUser += 1;
        people[numberUser].name = _name;
        people[numberUser].email = _email;
        people[numberUser].id = _id;
        ids[_id] = numberUser;

        emit NewPerson(_name,_email,_id);
        
    }

   
    
}
